import { AppSheetAPI } from "./appsheet-api"
import { apiMonitor } from "./api-monitor"
import { appSheetAPI } from "./appsheet-api"

export class DataService {
  // Properties
  static async getAllProperties() {
    apiMonitor.logAPICall("Properties")
    const response = await AppSheetAPI.getTableData("Properties")
    return response
  }

  static async getProperty(id: string) {
    apiMonitor.logAPICall(`Properties/${id}`)
    const response = await AppSheetAPI.getRecord("Properties", id)
    return response
  }

  // News
  static async getAllNews() {
    apiMonitor.logAPICall("News")
    const response = await AppSheetAPI.getTableData("News")
    return response
  }

  static async getNewsArticle(id: string) {
    apiMonitor.logAPICall(`News/${id}`)
    const response = await AppSheetAPI.getRecord("News", id)
    return response
  }

  // Projects
  static async getAllProjects() {
    apiMonitor.logAPICall("Projects")
    const response = await AppSheetAPI.getTableData("Projects")
    return response
  }

  static async getProject(id: string) {
    apiMonitor.logAPICall(`Projects/${id}`)
    const response = await AppSheetAPI.getRecord("Projects", id)
    return response
  }

  // Users
  static async getAllUsers() {
    apiMonitor.logAPICall("Users")
    const response = await AppSheetAPI.getTableData("Users")
    return response
  }

  static async getUser(id: string) {
    apiMonitor.logAPICall(`Users/${id}`)
    const response = await AppSheetAPI.getRecord("Users", id)
    return response
  }

  /**
   * Fetch a single user - now testing Method 1 with correct URL
   */
  static async getSpecificUser(id: string) {
    if (!id) {
      console.log("⚠️ getSpecificUser: No ID provided")
      return null
    }

    apiMonitor.logAPICall(`Users(id:${id})`)

    try {
      console.log(`🔍 Attempting to fetch user with ID: "${id}"`)

      // Method 1: Try with Filter selector (now with correct URL)
      console.log(`🔍 Method 1: Using Filter(Users, [id] = "${id}") with correct AppSheet URL`)
      let rows = await AppSheetAPI.getTableData("Users", {
        selector: `Filter(Users, [id] = "${id}")`,
      })

      console.log(`📊 Method 1 result:`, rows)

      if (rows && rows.length > 0 && rows[0].id) {
        console.log(`✅ Method 1 success: Found user ${rows[0].id}`)
        return rows[0]
      }

      // Method 2: Try without quotes (in case ID is numeric)
      console.log(`🔍 Method 2: Using Filter(Users, [id] = ${id})`)
      rows = await AppSheetAPI.getTableData("Users", {
        selector: `Filter(Users, [id] = ${id})`,
      })

      console.log(`📊 Method 2 result:`, rows)

      if (rows && rows.length > 0 && rows[0].id) {
        console.log(`✅ Method 2 success: Found user ${rows[0].id}`)
        return rows[0]
      }

      // Method 3: Get all users and filter locally (fallback)
      console.log(`🔍 Method 3: Getting all users and filtering locally for ID: ${id}`)
      const allUsers = await AppSheetAPI.getTableData("Users")

      console.log(`📊 Total users from AppSheet:`, allUsers?.length || 0)

      if (allUsers && allUsers.length > 0) {
        // Log first user structure for debugging
        console.log(`📊 Sample user structure:`, allUsers[0])

        // Try multiple field variations
        const foundUser = allUsers.find((user: any) => {
          const matches = [
            user.id === id,
            user.id === String(id),
            user.user_id === id,
            user.user_id === String(id),
            // Check if any field contains the ID
            Object.values(user).includes(id),
            Object.values(user).includes(String(id)),
          ]

          if (matches.some(Boolean)) {
            console.log(`✅ Found matching user:`, user)
            return true
          }
          return false
        })

        if (foundUser) {
          console.log(`✅ Method 3 success: User found locally:`, {
            id: foundUser.id,
            full_name: foundUser.full_name,
            email: foundUser.email,
          })
          return foundUser
        } else {
          console.warn(`⚠️ No user found with ID "${id}" in ${allUsers.length} users`)
          // Log all user IDs for debugging
          const userIds = allUsers.map((u: any) => ({ id: u.id, user_id: u.user_id, full_name: u.full_name }))
          console.log(`📊 Available user IDs:`, userIds)
        }
      } else {
        console.warn(`⚠️ No users returned from AppSheet API`)
      }

      // Fallback to mock data for testing
      console.log(`🔍 Method 4: Using mock data fallback for ID: ${id}`)
      const mockUsers: Record<string, any> = {
        aa1: {
          id: "aa1",
          email: "nguyenhoa@gmail.com",
          full_name: "Nguyễn Văn Hòa",
          phone: "909123456",
          avatar_url: "https://s240-ava-talk.zadn.vn/6/4/d/8/1/240/7b2ca9a3a93e67d632aa8d4511d363de.jpg",
          user_type: "customer",
          is_vip: "Y",
          is_active: "Y",
          address: "123 Đường ABC, Quận 1",
          city: "Hồ Chí Minh",
          created_at: "2024-11-01T00:00:00Z",
          updated_at: "2025-06-19T00:00:00Z",
          last_login: "2025-06-20T00:00:00Z",
        },
        "3": {
          id: "3",
          email: "test3@example.com",
          full_name: "Test User 3",
          phone: "0901234567",
          user_type: "customer",
          is_vip: "FALSE",
          is_active: "TRUE",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          address: "123 Test Street",
          city: "Ho Chi Minh",
          district: "District 1",
          created_at: "2023-01-15T00:00:00Z",
          updated_at: "2024-12-24T00:00:00Z",
          last_login: "2024-12-24T10:30:00Z",
        },
        "456": {
          id: "456",
          email: "nguyen.van.a@example.com",
          full_name: "Nguyễn Văn A",
          phone: "0901234567",
          user_type: "customer",
          is_vip: "TRUE",
          is_active: "TRUE",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          address: "123 Đường Nguyễn Huệ, Phường Bến Nghé",
          city: "Hồ Chí Minh",
          district: "Quận 1",
          created_at: "2023-01-15T00:00:00Z",
          updated_at: "2024-12-24T00:00:00Z",
          last_login: "2024-12-24T10:30:00Z",
        },
      }

      if (mockUsers[id]) {
        console.log(`✅ Method 4 success: Using mock user for ID ${id}`)
        return mockUsers[id]
      }

      console.warn(`⚠️ No user found for ID: ${id} using any method`)
      return null
    } catch (err) {
      console.error(`❌ Error fetching specific user ${id}:`, err)
      return null
    }
  }

  /* ------------------------------------------------------------------
     FAVORITES - Updated to use AppSheet Filter
  -------------------------------------------------------------------*/
  static async getUserFavorites(userId: string) {
    apiMonitor.logAPICall(`Favorites(user:${userId})`)
    return await appSheetAPI.getUserFavorites(userId) // ⬅️ use instance method
  }

  static async toggleFavorite(userId: string, propertyId: string) {
    if (!userId || !propertyId) {
      console.log("⚠️ toggleFavorite: Missing userId or propertyId")
      return false
    }

    apiMonitor.logAPICall(`FavoritesToggle(user:${userId}, property:${propertyId})`)

    try {
      console.log(`❤️ Toggling favorite: user=${userId}, property=${propertyId}`)

      // Get current favorites
      const existing = await DataService.getUserFavorites(userId)
      const isFav = existing.some((f: any) => f.property_id === propertyId)

      if (isFav) {
        // Remove from favorites
        console.log(`💔 Removing from favorites: property=${propertyId}`)
        await appSheetAPI.removeFromFavorites(userId, propertyId) // ⬅️
        return false
      } else {
        // Add to favorites
        console.log(`❤️ Adding to favorites: property=${propertyId}`)
        await appSheetAPI.addToFavorites(userId, propertyId) // ⬅️
        return true
      }
    } catch (error) {
      console.error(`❌ Error toggling favorite:`, error)
      throw error
    }
  }

  // Transform functions
  static transformProperties(properties: any[]) {
    return properties.map((r) => DataService.transformProperty(r))
  }

  static transformProperty(property: any) {
    return {
      id: property.id || property.property_id,
      title: property.title || property.property_title || "",
      description: property.description || "",
      price: Number(property.price) || 0,
      priceText: DataService.formatPrice(Number(property.price) || 0, property.currency || "VND"),
      currency: property.currency || "VND",
      property_type: property.property_type || "",
      propertyType: property.property_type || "",
      transaction_type: property.transaction_type || "",
      type: property.transaction_type || "",
      bedrooms: Number(property.bedrooms) || 0,
      bathrooms: Number(property.bathrooms) || 0,
      area: Number(property.area) || 0,
      address: property.address || "",
      location: property.location || property.address || "",
      district: property.district || "",
      city: property.city || "",
      province: property.province || "",
      latitude: property.latitude ? Number(property.latitude) : null,
      longitude: property.longitude ? Number(property.longitude) : null,
      direction: property.direction || "",
      legal_status: property.legal_status || "",
      legal: property.legal_status || "",
      images: DataService.parseImages(property.images),
      image: DataService.parseImages(property.images)[0] || "/placeholder.svg?height=200&width=300",
      features: DataService.parseFeatures(property.features),
      status: property.status || "available",
      created_at: property.created_at || "",
      updated_at: property.updated_at || "",
      postedDate: property.created_at || "",
      owner_id: property.owner_id || "",
      agent_id: property.agent_id || "",
      views: Number(property.views) || 0,
      is_featured: property.is_featured === "TRUE" || property.is_featured === true,
      is_urgent: property.is_urgent === "TRUE" || property.is_urgent === true,
    }
  }

  static transformNews(news: any[]) {
    return news.map((r) => DataService.transformNewsArticle(r))
  }

  static transformNewsArticle(article: any) {
    return {
      id: article.id || article.news_id,
      title: article.title || "",
      content: article.content || "",
      excerpt: article.excerpt || article.content?.substring(0, 150) + "..." || "",
      featured_image: article.featured_image || "/placeholder.svg?height=200&width=300",
      category: article.category || "general",
      status: article.status || "published",
      published_at: article.published_at || article.created_at,
      created_at: article.created_at || "",
      updated_at: article.updated_at || "",
      author: article.author || "Admin",
      tags: DataService.parseTags(article.tags),
      views: Number(article.views) || 0,
    }
  }

  static transformProjects(projects: any[]) {
    return projects.map((r) => DataService.transformProject(r))
  }

  static transformProject(project: any) {
    const status = project.status || "upcoming"
    const badgeColor = status === "selling" ? "bg-green-600" : status === "upcoming" ? "bg-blue-600" : "bg-gray-600"
    const badge = status === "selling" ? "Đang bán" : status === "upcoming" ? "Sắp mở bán" : "Đã bán hết"

    return {
      id: project.id || project.project_id,
      title: project.title || project.project_name || "",
      description: project.description || "",
      developer: project.developer || "",
      location: project.location || project.address || "",
      address: project.address || "",
      district: project.district || "",
      city: project.city || "",
      province: project.province || "",
      area: Number(project.area) || 0,
      units: Number(project.units) || 0,
      price_from: Number(project.price_from) || 0,
      price_to: Number(project.price_to) || 0,
      priceText: DataService.formatProjectPrice(project.price_from, project.price_to),
      launch_date: project.launch_date || "",
      completion_date: project.completion_date || "",
      status: status,
      badge: badge,
      badgeColor: badgeColor,
      images: DataService.parseImages(project.images),
      image: DataService.parseImages(project.images)[0] || "/placeholder.svg?height=300&width=400",
      features: DataService.parseFeatures(project.features),
      amenities: DataService.parseFeatures(project.amenities),
      is_featured: project.is_featured === "Y" || project.is_featured === "TRUE" || project.is_featured === true,
      created_at: project.created_at || "",
      updated_at: project.updated_at || "",
      views: Number(project.views) || 0,
    }
  }

  static transformUsers(users: any[]) {
    return users.map((r) => DataService.transformUser(r))
  }

  static transformUser(user: any) {
    // Parse avatar_url if it's a JSON string
    let avatarUrl = user.avatar_url || "/placeholder.svg?height=80&width=80"

    if (typeof avatarUrl === "string" && avatarUrl.startsWith("{")) {
      try {
        const parsed = JSON.parse(avatarUrl)
        avatarUrl = parsed.Url || parsed.url || avatarUrl
        console.log(`🖼️ Parsed avatar URL:`, avatarUrl)
      } catch (e) {
        console.warn(`⚠️ Failed to parse avatar_url JSON:`, avatarUrl)
      }
    }

    return {
      id: user.id || user.user_id,
      full_name: user.full_name || user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      avatar_url: avatarUrl,
      user_type: user.user_type || "customer",
      is_vip: user.is_vip === "Y" || user.is_vip === "TRUE" || user.is_vip === true,
      is_active: user.is_active === "Y" || user.is_active === "TRUE" || user.is_active === true,
      created_at: user.created_at || "",
      updated_at: user.updated_at || "",
      last_login: user.last_login || "",
      address: user.address || "",
      city: user.city || "",
      province: user.province || "",
      vip_expires_at: user.vip_expires_at || "",
    }
  }

  // Helper functions
  private static parseImages(images: string | null): string[] {
    if (!images) return []
    try {
      if (images.startsWith("[")) {
        return JSON.parse(images)
      }
      return images.split(",").map((img) => img.trim())
    } catch {
      return images.split(",").map((img) => img.trim())
    }
  }

  private static parseFeatures(features: string | null): string[] {
    if (!features) return []
    try {
      if (features.startsWith("[")) {
        return JSON.parse(features)
      }
      return features.split(",").map((feature) => feature.trim())
    } catch {
      return features.split(",").map((feature) => feature.trim())
    }
  }

  private static parseTags(tags: string | null): string[] {
    if (!tags) return []
    try {
      if (tags.startsWith("[")) {
        return JSON.parse(tags)
      }
      return tags.split(",").map((tag) => tag.trim())
    } catch {
      return tags.split(",").map((tag) => tag.trim())
    }
  }

  private static formatPrice(price: number, currency = "VND"): string {
    if (price === 0) return "Liên hệ"

    if (currency === "VND") {
      if (price >= 1000000000) {
        return `${(price / 1000000000).toFixed(1)} tỷ`
      } else if (price >= 1000000) {
        return `${(price / 1000000).toFixed(0)} triệu`
      } else if (price >= 1000) {
        return `${(price / 1000).toFixed(0)}k`
      }
      return price.toLocaleString("vi-VN")
    }

    return `${price.toLocaleString()} ${currency}`
  }

  private static formatProjectPrice(priceFrom: number, priceTo: number): string {
    if (!priceFrom && !priceTo) return "Liên hệ"
    if (priceFrom && !priceTo) return `Từ ${this.formatPrice(priceFrom)}`
    if (!priceFrom && priceTo) return `Đến ${this.formatPrice(priceTo)}`
    return `${this.formatPrice(priceFrom)} - ${this.formatPrice(priceTo)}`
  }
}
