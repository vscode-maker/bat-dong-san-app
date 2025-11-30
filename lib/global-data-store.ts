import { DataService } from "./data-service"

interface AppData {
  properties: any[]
  news: any[]
  projects: any[]
  users: any[]
  currentUser: any | null
}

interface LoadingState {
  properties: boolean
  news: boolean
  projects: boolean
  users: boolean
  currentUser: boolean
  global: boolean
}

interface ErrorState {
  properties: string | null
  news: string | null
  projects: string | null
  users: string | null
  currentUser: string | null
}

class GlobalDataStore {
  private static instance: GlobalDataStore
  private data: AppData = {
    properties: [],
    news: [],
    projects: [],
    users: [],
    currentUser: null,
  }

  private loading: LoadingState = {
    properties: true,
    news: true,
    projects: true,
    users: false,
    currentUser: false,
    global: true,
  }

  private errors: ErrorState = {
    properties: null,
    news: null,
    projects: null,
    users: null,
    currentUser: null,
  }

  private isInitialized = false
  private isInitializing = false
  private initPromise: Promise<void> | null = null
  private subscribers: Set<() => void> = new Set()
  private currentUserId: string | null = null

  // Track loading promises to prevent duplicates
  private userLoadingPromises: Map<string, Promise<any>> = new Map()

  static getInstance(): GlobalDataStore {
    if (!GlobalDataStore.instance) {
      GlobalDataStore.instance = new GlobalDataStore()
    }
    return GlobalDataStore.instance
  }

  // Subscribe to data changes
  subscribe(callback: () => void) {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  // Notify all subscribers
  private notify() {
    this.subscribers.forEach((callback) => callback())
  }

  // Check URL for id parameter
  private getUrlUserId(): string | null {
    if (typeof window === "undefined") return null
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("id")
  }

  // Initialize data - ONLY ONCE EVER
  async initialize(): Promise<void> {
    // If already initialized, return immediately
    if (this.isInitialized) {
      console.log("🔒 Data already initialized globally, skipping...")

      // Check if we need to load a different user
      const urlUserId = this.getUrlUserId()
      if (urlUserId && urlUserId !== this.currentUserId) {
        await this.loadCurrentUser(urlUserId)
      }
      return
    }

    // If currently initializing, wait for existing promise
    if (this.isInitializing && this.initPromise) {
      console.log("⏳ Global initialization in progress, waiting...")
      await this.initPromise
      return
    }

    // Start initialization
    console.log("🚀 GLOBAL DATA INITIALIZATION (ONCE AND ONLY ONCE)")
    this.isInitializing = true

    this.initPromise = this.performInitialization()
    await this.initPromise
  }

  private async performInitialization(): Promise<void> {
    this.setLoading({ ...this.loading, global: true })

    // Check URL for user ID
    const urlUserId = this.getUrlUserId()
    console.log(`🔍 Checking URL for user ID: ${urlUserId || "none"}`)

    // Always fetch public data (Properties, News, Projects)
    const publicPromises = [
      DataService.getAllProperties().catch((err) => {
        console.error("❌ Error fetching properties:", err)
        this.setError("properties", err.message)
        return []
      }),
      DataService.getAllNews().catch((err) => {
        console.error("❌ Error fetching news:", err)
        this.setError("news", err.message)
        return []
      }),
      DataService.getAllProjects().catch((err) => {
        console.error("❌ Error fetching projects:", err)
        this.setError("projects", err.message)
        return []
      }),
    ]

    // Only fetch user data if URL has id parameter
    let userPromise: Promise<any> = Promise.resolve(null)
    if (urlUserId) {
      console.log(`🔍 URL has id=${urlUserId}, will load user data`)
      this.currentUserId = urlUserId
      userPromise = this.loadUserWithDeduplication(urlUserId)
    } else {
      console.log("👤 No id parameter in URL, skipping Users API call")
    }

    try {
      const [properties, news, projects, currentUser] = await Promise.all([...publicPromises, userPromise])

      this.data = {
        properties,
        news,
        projects,
        users: [], // We don't load all users anymore
        currentUser,
      }

      console.log("✅ GLOBAL DATA INITIALIZED SUCCESSFULLY:", {
        properties: properties.length,
        news: news.length,
        projects: projects.length,
        currentUser: currentUser ? `User ${currentUser.id} (${currentUser.full_name || currentUser.name})` : "No user",
      })

      this.isInitialized = true
    } catch (error) {
      console.error("❌ Global initialization error:", error)
    } finally {
      this.setLoading({
        properties: false,
        news: false,
        projects: false,
        users: false,
        currentUser: false,
        global: false,
      })
      this.isInitializing = false
    }
  }

  // Load user with deduplication
  private async loadUserWithDeduplication(userId: string): Promise<any> {
    // Check if we're already loading this user
    if (this.userLoadingPromises.has(userId)) {
      console.log(`⏳ User ${userId} already being loaded, waiting for existing promise...`)
      return await this.userLoadingPromises.get(userId)!
    }

    // Create new loading promise
    const loadingPromise = this.performUserLoad(userId)
    this.userLoadingPromises.set(userId, loadingPromise)

    try {
      const result = await loadingPromise
      return result
    } finally {
      // Clean up the promise after completion
      this.userLoadingPromises.delete(userId)
    }
  }

  // Actual user loading logic
  private async performUserLoad(userId: string): Promise<any> {
    console.log(`🔍 Loading user data with Filter(Users, [id] = "${userId}")`)

    try {
      const user = await DataService.getSpecificUser(userId)
      if (user) {
        console.log(`✅ User ${userId} loaded successfully:`, user.full_name || user.name || "Unknown")
      } else {
        console.warn(`⚠️ No user found for ID: ${userId}`)
      }
      return user
    } catch (error) {
      console.error(`❌ Error loading user ${userId}:`, error)
      throw error
    }
  }

  // Load specific user when URL changes
  async loadCurrentUser(userId: string): Promise<void> {
    // Check if user is already loaded and current
    if (this.currentUserId === userId && this.data.currentUser) {
      console.log(`🔒 User ${userId} already loaded and current, skipping...`)
      return
    }

    // Check if we're already loading this user
    if (this.userLoadingPromises.has(userId)) {
      console.log(`⏳ User ${userId} already being loaded, waiting...`)
      try {
        const user = await this.userLoadingPromises.get(userId)!
        this.currentUserId = userId
        this.data.currentUser = user
        this.notify()
      } catch (error) {
        this.setError("currentUser", error instanceof Error ? error.message : "Failed to load user")
        this.data.currentUser = null
      }
      return
    }

    this.setLoading({ ...this.loading, currentUser: true })
    this.setError("currentUser", null)
    this.currentUserId = userId

    try {
      const user = await this.loadUserWithDeduplication(userId)
      this.data.currentUser = user
      this.notify()
    } catch (error) {
      console.error(`❌ Error loading user ${userId}:`, error)
      this.setError("currentUser", error instanceof Error ? error.message : "Failed to load user")
      this.data.currentUser = null
    } finally {
      this.setLoading({ ...this.loading, currentUser: false })
    }
  }

  // Method to check and load user from current URL
  async checkAndLoadUserFromUrl(): Promise<void> {
    const urlUserId = this.getUrlUserId()
    if (urlUserId && urlUserId !== this.currentUserId) {
      await this.loadCurrentUser(urlUserId)
    } else if (!urlUserId && this.currentUserId) {
      // URL no longer has user ID, clear current user
      console.log("🔄 URL no longer has user ID, clearing current user")
      this.currentUserId = null
      this.data.currentUser = null
      // Cancel any pending user loads
      this.userLoadingPromises.clear()
      this.notify()
    }
  }

  // Getters
  getData(): AppData {
    return this.data
  }

  getLoading(): LoadingState {
    return this.loading
  }

  getErrors(): ErrorState {
    return this.errors
  }

  getIsInitialized(): boolean {
    return this.isInitialized
  }

  getCurrentUser(): any | null {
    return this.data.currentUser
  }

  getCurrentUserId(): string | null {
    return this.currentUserId
  }

  // Setters with notification
  private setLoading(loading: LoadingState) {
    this.loading = loading
    this.notify()
  }

  private setError(key: keyof ErrorState, error: string | null) {
    this.errors[key] = error
    this.notify()
  }

  // Manual refresh functions
  async refreshAll(): Promise<void> {
    console.log("🔄 Manual refresh: All data")
    this.isInitialized = false
    this.isInitializing = false
    this.initPromise = null
    this.userLoadingPromises.clear() // Clear pending user loads
    await this.initialize()
  }

  async refreshCurrentUser(): Promise<void> {
    const urlUserId = this.getUrlUserId()
    if (!urlUserId) {
      console.log("⚠️ No user ID in URL to refresh")
      return
    }
    console.log(`🔄 Manual refresh: Current user ${urlUserId}`)
    // Force reload by clearing the current user first
    if (this.currentUserId === urlUserId) {
      this.currentUserId = null
      this.data.currentUser = null
    }
    await this.loadCurrentUser(urlUserId)
  }

  async refreshProperties(): Promise<void> {
    console.log("🔄 Manual refresh: Properties")
    this.setLoading({ ...this.loading, properties: true })
    this.setError("properties", null)

    try {
      const properties = await DataService.getAllProperties()
      this.data.properties = properties
      this.notify()
    } catch (error) {
      this.setError("properties", error instanceof Error ? error.message : "Failed to fetch properties")
    } finally {
      this.setLoading({ ...this.loading, properties: false })
    }
  }

  async refreshNews(): Promise<void> {
    console.log("🔄 Manual refresh: News")
    this.setLoading({ ...this.loading, news: true })
    this.setError("news", null)

    try {
      const news = await DataService.getAllNews()
      this.data.news = news
      this.notify()
    } catch (error) {
      this.setError("news", error instanceof Error ? error.message : "Failed to fetch news")
    } finally {
      this.setLoading({ ...this.loading, news: false })
    }
  }

  async refreshProjects(): Promise<void> {
    console.log("🔄 Manual refresh: Projects")
    this.setLoading({ ...this.loading, projects: true })
    this.setError("projects", null)

    try {
      const projects = await DataService.getAllProjects()
      this.data.projects = projects
      this.notify()
    } catch (error) {
      this.setError("projects", error instanceof Error ? error.message : "Failed to fetch projects")
    } finally {
      this.setLoading({ ...this.loading, projects: false })
    }
  }

  // Data filtering and transformation methods
  getProperties(filters?: any): any[] {
    if (!this.isInitialized) return []

    if (!filters) {
      return DataService.transformProperties(this.data.properties)
    }

    const filtered = this.data.properties.filter((property: any) => {
      if (filters.transactionType && property.transaction_type !== filters.transactionType) return false
      if (filters.propertyType && property.property_type !== filters.propertyType) return false
      if (filters.minPrice && Number(property.price) < filters.minPrice) return false
      if (filters.maxPrice && Number(property.price) > filters.maxPrice) return false
      if (filters.district && property.district !== filters.district) return false
      if (filters.city && property.city !== filters.city) return false
      if (filters.featured && !(property.is_featured === "TRUE" || property.is_featured === true)) return false
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableText =
          `${property.title || ""} ${property.description || ""} ${property.address || ""}`.toLowerCase()
        if (!searchableText.includes(searchTerm)) return false
      }
      return true
    })

    return DataService.transformProperties(filtered)
  }

  getProperty(id: string): any | null {
    if (!this.isInitialized) return null
    const property = this.data.properties.find((p: any) => p.id === id)
    return property ? DataService.transformProperty(property) : null
  }

  getNews(filters?: any): any[] {
    if (!this.isInitialized) return []

    let filtered = this.data.news.filter((article: any) => article.status === "published")

    if (filters?.category) {
      filtered = filtered.filter((article: any) => article.category === filters.category)
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter((article: any) => {
        const searchableText = `${article.title || ""} ${article.content || ""}`.toLowerCase()
        return searchableText.includes(searchTerm)
      })
    }

    filtered = filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.published_at || a.created_at)
      const dateB = new Date(b.published_at || b.created_at)
      return dateB.getTime() - dateA.getTime()
    })

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit)
    }

    return DataService.transformNews(filtered)
  }

  getNewsArticle(id: string): any | null {
    if (!this.isInitialized) return null
    const article = this.data.news.find((n: any) => n.id === id)
    return article ? DataService.transformNewsArticle(article) : null
  }

  getProjects(filters?: any): any[] {
    if (!this.isInitialized) return []

    let filtered = this.data.projects

    if (filters?.status) {
      filtered = filtered.filter((project: any) => project.status === filters.status)
    }

    if (filters?.featured) {
      filtered = filtered.filter(
        (project: any) => project.is_featured === "Y" || project.is_featured === "TRUE" || project.is_featured === true,
      )
    }

    if (filters?.developer) {
      filtered = filtered.filter((project: any) => project.developer === filters.developer)
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter((project: any) => {
        const searchableText =
          `${project.title || ""} ${project.description || ""} ${project.developer || ""}`.toLowerCase()
        return searchableText.includes(searchTerm)
      })
    }

    filtered = filtered.sort((a: any, b: any) => {
      const aFeatured = a.is_featured === "Y" || a.is_featured === "TRUE" || a.is_featured === true
      const bFeatured = b.is_featured === "Y" || b.is_featured === "TRUE" || b.is_featured === true

      if (aFeatured && !bFeatured) return -1
      if (!aFeatured && bFeatured) return 1

      const dateA = new Date(a.launch_date || a.created_at)
      const dateB = new Date(b.launch_date || b.created_at)
      return dateB.getTime() - dateA.getTime()
    })

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit)
    }

    return DataService.transformProjects(filtered)
  }

  getProject(id: string): any | null {
    if (!this.isInitialized) return null
    const project = this.data.projects.find((p: any) => p.id === id)
    return project ? DataService.transformProject(project) : null
  }

  // Legacy methods for backward compatibility
  getUsers(filters?: any): any[] {
    // Return current user as array if available
    if (this.data.currentUser) {
      return [DataService.transformUser(this.data.currentUser)]
    }
    return []
  }

  getUser(id: string): any | null {
    // Return current user if ID matches
    if (this.data.currentUser && this.data.currentUser.id === id) {
      return DataService.transformUser(this.data.currentUser)
    }
    return null
  }
}

export const globalDataStore = GlobalDataStore.getInstance()

// Initialize when module loads, but check URL first
if (typeof window !== "undefined") {
  globalDataStore.initialize().catch(console.error)
}

// Global functions for debugging
if (typeof window !== "undefined") {
  ;(window as any).globalDataStore = globalDataStore
  ;(window as any).checkGlobalData = () => {
    console.log("🌍 Global Data Store Status:", {
      initialized: globalDataStore.getIsInitialized(),
      currentUserId: globalDataStore.getCurrentUserId(),
      currentUser: globalDataStore.getCurrentUser()?.full_name || "None",
      data: globalDataStore.getData(),
      loading: globalDataStore.getLoading(),
      errors: globalDataStore.getErrors(),
    })
  }
  ;(window as any).checkUrlUser = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get("id")
    console.log("🔍 URL User ID:", userId || "none")
    if (userId) {
      globalDataStore.loadCurrentUser(userId)
    }
  }
  ;(window as any).checkUserPromises = () => {
    console.log("🔍 Active User Loading Promises:", globalDataStore["userLoadingPromises"].size)
  }
}
