"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { globalDataStore } from "@/lib/global-data-store"

interface DataContextType {
  // Properties
  properties: any[]
  getProperties: (filters?: any) => any[]
  getProperty: (id: string) => any | null
  refreshProperties: () => Promise<void>

  // News
  news: any[]
  getNews: (filters?: any) => any[]
  getNewsArticle: (id: string) => any | null
  refreshNews: () => Promise<void>

  // Projects
  projects: any[]
  getProjects: (filters?: any) => any[]
  getProject: (id: string) => any | null
  refreshProjects: () => Promise<void>

  // Users
  users: any[]
  getUsers: (filters?: any) => any[]
  getUser: (id: string) => any | null
  getCurrentUser: () => any | null
  getCurrentUserId: () => string | null

  // Loading states
  loading: {
    properties: boolean
    news: boolean
    projects: boolean
    users: boolean
    currentUser: boolean
    global: boolean
  }

  // Error states
  errors: {
    properties: string | null
    news: string | null
    projects: string | null
    users: string | null
    currentUser: string | null
  }

  // Global state
  isInitialized: boolean
  refreshAll: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(globalDataStore.getData())
  const [loading, setLoading] = useState(globalDataStore.getLoading())
  const [errors, setErrors] = useState(globalDataStore.getErrors())
  const [isInitialized, setIsInitialized] = useState(globalDataStore.getIsInitialized())

  useEffect(() => {
    // Initialize global store once
    console.log("🔄 DataProvider: Initializing global store...")
    globalDataStore.initialize()

    // Subscribe to changes
    const unsubscribe = globalDataStore.subscribe(() => {
      setData(globalDataStore.getData())
      setLoading(globalDataStore.getLoading())
      setErrors(globalDataStore.getErrors())
      setIsInitialized(globalDataStore.getIsInitialized())
    })

    return unsubscribe
  }, [])

  // Monitor URL changes for user loading
  useEffect(() => {
    const handleUrlChange = () => {
      globalDataStore.checkAndLoadUserFromUrl()
    }

    // Check on mount
    handleUrlChange()

    // Listen for URL changes (for SPA navigation)
    window.addEventListener("popstate", handleUrlChange)

    return () => {
      window.removeEventListener("popstate", handleUrlChange)
    }
  }, [])

  const contextValue: DataContextType = {
    // Properties
    properties: data.properties,
    getProperties: (filters?: any) => globalDataStore.getProperties(filters),
    getProperty: (id: string) => globalDataStore.getProperty(id),
    refreshProperties: () => globalDataStore.refreshProperties(),

    // News
    news: data.news,
    getNews: (filters?: any) => globalDataStore.getNews(filters),
    getNewsArticle: (id: string) => globalDataStore.getNewsArticle(id),
    refreshNews: () => globalDataStore.refreshNews(),

    // Projects
    projects: data.projects,
    getProjects: (filters?: any) => globalDataStore.getProjects(filters),
    getProject: (id: string) => globalDataStore.getProject(id),
    refreshProjects: () => globalDataStore.refreshProjects(),

    // Users
    users: data.users,
    getUsers: (filters?: any) => globalDataStore.getUsers(filters),
    getUser: (id: string) => globalDataStore.getUser(id),
    getCurrentUser: () => globalDataStore.getCurrentUser(),
    getCurrentUserId: () => globalDataStore.getCurrentUserId(),

    // Loading states
    loading,

    // Error states
    errors,

    // Global state
    isInitialized,
    refreshAll: () => globalDataStore.refreshAll(),
  }

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

// Alias để vẫn hỗ trợ các import cũ
export { useData as useAppData }
