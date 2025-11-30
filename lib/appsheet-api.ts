// AppSheet API Integration for CRUD Operations

interface AppSheetConfig {
  appId: string
  accessKey: string
  baseUrl: string
}

export class AppSheetAPI {
  private config: AppSheetConfig

  constructor(config: AppSheetConfig) {
    this.config = config
    console.log("AppSheet Config:", {
      appId: config.appId,
      hasAccessKey: !!config.accessKey,
      baseUrl: config.baseUrl,
    })
  }

  private async makeRequest(method: string, tableName: string, data?: any, selector?: string) {
    try {
      // Use the correct AppSheet URL format
      const url = `${this.config.baseUrl}${this.config.appId}/tables/${encodeURIComponent(tableName)}/Action`
      console.log(`🔗 AppSheet URL: ${url}`)

      const requestBody: any = {
        Action: method,
        Properties: {},
        Rows: data ? [data] : [],
      }

      // Add selector for filtering if provided
      if (selector) {
        requestBody.Properties.Selector = selector
        console.log(`🔍 AppSheet Action request for ${tableName}:`, {
          Action: method,
          Selector: selector,
          URL: url,
        })
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          // Use correct header name (lowercase 'a')
          applicationAccessKey: this.config.accessKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log(`📡 AppSheet Response Status: ${response.status} ${response.statusText}`)

      // --- fallback to GET /tables/{table}/data if POST /Action fails (404/400) ---
      if (method === "Find" && !selector && (response.status === 404 || response.status === 400)) {
        console.log(`⚠️ POST /Action failed (${response.status}), trying GET fallback...`)
        const getUrl = `${this.config.baseUrl}${this.config.appId}/tables/${encodeURIComponent(tableName)}/data`

        const getRes = await fetch(getUrl, {
          method: "GET",
          headers: { applicationAccessKey: this.config.accessKey },
        })

        if (!getRes.ok) {
          const txt = await getRes.text().catch(() => "")
          throw new Error(`AppSheet GET fallback failed: ${getRes.status} ${getRes.statusText}\n${txt}`)
        }

        const result = await getRes.json()
        console.log(`✅ GET fallback successful for ${tableName}:`, result)
        return result
      }

      // Handle error responses for POST /Action
      if (!response.ok) {
        const errorText = await response.text().catch(() => "")
        console.error(`❌ AppSheet POST /Action failed:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          request: requestBody,
        })

        // If selector failed, try GET fallback
        if (method === "Find" && selector) {
          console.log(`🔄 Selector failed, trying GET all data fallback...`)
          const getUrl = `${this.config.baseUrl}${this.config.appId}/tables/${encodeURIComponent(tableName)}/data`

          const getRes = await fetch(getUrl, {
            method: "GET",
            headers: { applicationAccessKey: this.config.accessKey },
          })

          if (getRes.ok) {
            const result = await getRes.json()
            console.log(`✅ GET fallback after selector failure:`, result)
            return result
          }
        }

        throw new Error(`Lỗi API: ${response.status} ${response.statusText}${errorText ? `\n${errorText}` : ""}`)
      }

      // Nếu server trả về 204 hoặc body không phải JSON, coi như thao tác thành công.
      const contentType = response.headers.get("content-type") ?? ""
      if (response.status === 204 || !contentType.includes("application/json")) {
        return [] // Hoặc trả về {} tuỳ ý, ở đây phần còn lại của code expect array
      }

      // Parse JSON response
      const responseData = await response.json()
      console.log(`✅ AppSheet POST /Action successful for ${tableName}:`, {
        method,
        selector,
        rowCount: responseData?.Rows?.length || responseData?.length || 0,
        sample: responseData?.Rows?.[0] || responseData?.[0] || null,
      })

      // Return the Rows array or empty array
      return responseData?.Rows || responseData || []
    } catch (error) {
      console.error(`❌ Lỗi khi ${method} dữ liệu từ bảng ${tableName}:`, error)
      throw error
    }
  }

  /**
   * Generic helper – fetch rows from any table.
   * @param tableName Name of the AppSheet table
   * @param options   Options object with selector or other params
   */
  async getTableData(tableName: string, options?: { selector?: string } | string) {
    // Handle legacy string selector parameter
    const selector = typeof options === "string" ? options : options?.selector

    if (selector) {
      console.log(`🔍 getTableData with selector: ${selector}`)
      return this.makeRequest("Find", tableName, null, selector)
    } else {
      console.log(`🔍 getTableData without selector (get all)`)
      // Try POST /Action first, then GET fallback
      return this.makeRequest("Find", tableName, null, null)
    }
  }

  // Properties CRUD
  async getProperties(selector?: string) {
    console.log("getProperties selector:", selector)
    return this.makeRequest("Find", "Properties", null, selector)
  }

  async getProperty(id: string) {
    const selector = `Filter(Properties, [id] = "${id}")`
    const results = await this.makeRequest("Find", "Properties", null, selector)
    return results[0] || null
  }

  async createProperty(property: any) {
    const propertyData = {
      ...property,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Add", "Properties", propertyData)
    return { success: true, data: result }
  }

  async updateProperty(id: string, updates: any) {
    const propertyData = {
      id,
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Edit", "Properties", propertyData)
    return { success: true, data: result }
  }

  async deleteProperty(id: string) {
    const result = await this.makeRequest("Delete", "Properties", { id })
    return { success: true, data: result }
  }

  // Users CRUD
  async getUsers(selector?: string) {
    return this.makeRequest("Find", "Users", null, selector)
  }

  async getUser(id: string) {
    const selector = `Filter(Users, [id] = "${id}")`
    const results = await this.makeRequest("Find", "Users", null, selector)
    return results[0] || null
  }

  async createUser(user: any) {
    const userData = {
      ...user,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Add", "Users", userData)
    return { success: true, data: result }
  }

  async updateUser(id: string, updates: any) {
    const userData = {
      id,
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Edit", "Users", userData)
    return { success: true, data: result }
  }

  // Thêm method deleteUser vào AppSheetAPI class

  async deleteUser(id: string) {
    const result = await this.makeRequest("Delete", "Users", { id })
    return { success: true, data: result }
  }

  // Favorites CRUD - Updated to use Filter selector
  async getUserFavorites(userId: string) {
    const selector = `Filter(Favorites, [user_id] = "${userId}")`
    console.log(`❤️ Getting favorites for user ${userId} with selector: ${selector}`)
    return this.makeRequest("Find", "Favorites", null, selector)
  }

  async addToFavorites(userId: string, propertyId: string) {
    const favoriteData = {
      id: this.generateId(),
      user_id: userId,
      property_id: propertyId,
      created_at: new Date().toISOString(),
    }

    console.log(`❤️ Adding to favorites:`, favoriteData)
    const result = await this.makeRequest("Add", "Favorites", favoriteData)
    return { success: true, data: result }
  }

  async removeFromFavorites(userId: string, propertyId: string) {
    // First find the favorite record using Filter
    console.log(`💔 Finding favorite to remove: user=${userId}, property=${propertyId}`)
    const favorites = await this.getUserFavorites(userId)
    const favorite = favorites.find((f: any) => f.property_id === propertyId)

    if (favorite) {
      console.log(`💔 Removing favorite:`, favorite)
      const result = await this.makeRequest("Delete", "Favorites", { id: favorite.id })
      return { success: true, data: result }
    }

    console.warn(`💔 Favorite not found for user=${userId}, property=${propertyId}`)
    return { success: false, message: "Favorite not found" }
  }

  // Saved Filters CRUD
  async getUserSavedFilters(userId: string) {
    const selector = `Filter(Saved_Filters, [user_id] = "${userId}")`
    return this.makeRequest("Find", "Saved_Filters", null, selector)
  }

  async saveFilter(userId: string, name: string, filters: any) {
    const filterData = {
      id: this.generateId(),
      user_id: userId,
      name,
      filters: JSON.stringify(filters),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Add", "Saved_Filters", filterData)
    return { success: true, data: result }
  }

  async deleteSavedFilter(id: string) {
    const result = await this.makeRequest("Delete", "Saved_Filters", { id })
    return { success: true, data: result }
  }

  // Consultations CRUD
  async createConsultation(consultation: any) {
    const consultationData = {
      ...consultation,
      id: this.generateId(),
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Add", "Consultations", consultationData)
    return { success: true, data: result }
  }

  async getConsultations(selector?: string) {
    return this.makeRequest("Find", "Consultations", null, selector)
  }

  async updateConsultationStatus(id: string, status: string) {
    const consultationData = {
      id,
      status,
      updated_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Edit", "Consultations", consultationData)
    return { success: true, data: result }
  }

  // News CRUD
  async getNews(selector?: string) {
    return this.makeRequest("Find", "News", null, selector)
  }

  async getNewsArticle(id: string) {
    const selector = `Filter(News, [id] = "${id}")`
    const results = await this.makeRequest("Find", "News", null, selector)
    return results[0] || null
  }

  async createNews(article: any) {
    const newsData = {
      ...article,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Add", "News", newsData)
    return { success: true, data: result }
  }

  async updateNews(id: string, updates: any) {
    const newsData = {
      id,
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Edit", "News", newsData)
    return { success: true, data: result }
  }

  async deleteNews(id: string) {
    const result = await this.makeRequest("Delete", "News", { id })
    return { success: true, data: result }
  }

  // Track news view
  async trackNewsView(newsId: string, userId?: string, ipAddress?: string) {
    const viewData = {
      id: this.generateId(),
      news_id: newsId,
      user_id: userId || "",
      ip_address: ipAddress || "",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      viewed_at: new Date().toISOString(),
    }

    try {
      const result = await this.makeRequest("Add", "News_Views", viewData)
      return { success: true, data: result }
    } catch (error) {
      console.warn("Failed to track news view:", error)
      return { success: false, error }
    }
  }

  // Projects CRUD
  async getProjects(selector?: string) {
    return this.makeRequest("Find", "Projects", null, selector)
  }

  async getProject(id: string) {
    const selector = `Filter(Projects, [id] = "${id}")`
    const results = await this.makeRequest("Find", "Projects", null, selector)
    return results[0] || null
  }

  async createProject(project: any) {
    const projectData = {
      ...project,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Add", "Projects", projectData)
    return { success: true, data: result }
  }

  async updateProject(id: string, updates: any) {
    const projectData = {
      id,
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Edit", "Projects", projectData)
    return { success: true, data: result }
  }

  async deleteProject(id: string) {
    const result = await this.makeRequest("Delete", "Projects", { id })
    return { success: true, data: result }
  }

  // Track project view
  async trackProjectView(projectId: string, userId?: string, ipAddress?: string) {
    const viewData = {
      id: this.generateId(),
      project_id: projectId,
      user_id: userId || "",
      ip_address: ipAddress || "",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      viewed_at: new Date().toISOString(),
    }

    try {
      const result = await this.makeRequest("Add", "Project_Views", viewData)
      return { success: true, data: result }
    } catch (error) {
      console.warn("Failed to track project view:", error)
      return { success: false, error }
    }
  }

  // Property Types
  async getPropertyTypes(selector?: string) {
    return this.makeRequest("Find", "Property_Types", null, selector)
  }

  // Comparisons CRUD
  async getUserComparisons(userId: string) {
    const selector = `Filter(Comparisons, [user_id] = "${userId}")`
    return this.makeRequest("Find", "Comparisons", null, selector)
  }

  async saveComparison(userId: string, propertyIds: string[], name: string) {
    const comparisonData = {
      id: this.generateId(),
      user_id: userId,
      property_ids: JSON.stringify(propertyIds),
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Add", "Comparisons", comparisonData)
    return { success: true, data: result }
  }

  // Analytics
  async trackPropertyView(propertyId: string, userId?: string, ipAddress?: string) {
    const viewData = {
      id: this.generateId(),
      property_id: propertyId,
      user_id: userId || "",
      ip_address: ipAddress || "",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      viewed_at: new Date().toISOString(),
    }

    const result = await this.makeRequest("Add", "Property_Views", viewData)
    return { success: true, data: result }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  /**
   * Static proxy so callers can do AppSheetAPI.getTableData(...)
   * instead of appSheetAPI.getTableData(...)
   */
  static getTableData(tableName: string, options?: { selector?: string } | string) {
    return appSheetAPI.getTableData(tableName, options)
  }
}

// Export singleton instance with correct base URL
export const appSheetAPI = new AppSheetAPI({
  appId: process.env.NEXT_PUBLIC_APPSHEET_APP_ID || "",
  accessKey: process.env.NEXT_PUBLIC_APPSHEET_ACCESS_KEY || "",
  baseUrl: "https://www.appsheet.com/api/v2/apps/", // Updated to match your working function
})

export default AppSheetAPI
