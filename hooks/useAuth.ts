"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { User } from "./useUsers"
import { globalDataStore } from "@/lib/global-data-store"

const AUTH_STORAGE_KEY = "real_estate_user_id"
const USER_DATA_STORAGE_KEY = "real_estate_user_data"

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlUserId = searchParams?.get("id") ?? null

  // Subscribe to global data store changes
  useEffect(() => {
    const unsubscribe = globalDataStore.subscribe(() => {
      const currentUser = globalDataStore.getCurrentUser()
      const currentUserId = globalDataStore.getCurrentUserId()

      if (currentUser && currentUserId) {
        // Transform global user data to local User format
        const transformedUser: User = {
          id: currentUser.id || currentUser.user_id,
          email: currentUser.email || "",
          full_name: currentUser.full_name || currentUser.name || "",
          phone: currentUser.phone || "",
          user_type: currentUser.user_type || "customer",
          is_vip: currentUser.is_vip === "Y" || currentUser.is_vip === "TRUE" || currentUser.is_vip === true,
          is_active:
            currentUser.is_active === "Y" || currentUser.is_active === "TRUE" || currentUser.is_active === true,
          avatar_url: currentUser.avatar_url || "/placeholder.svg?height=80&width=80",
          address: currentUser.address || "",
          city: currentUser.city || "",
          district: currentUser.district || "",
          date_of_birth: currentUser.date_of_birth || "",
          gender: currentUser.gender || "",
          occupation: currentUser.occupation || "",
          created_at: currentUser.created_at || "",
          updated_at: currentUser.updated_at || "",
          last_login: currentUser.last_login || "",
          total_favorites: currentUser.total_favorites || 0,
          total_saved_filters: currentUser.total_saved_filters || 0,
          total_consultations: currentUser.total_consultations || 0,
          vip_expires_at: currentUser.vip_expires_at || null,
          joinYear: currentUser.created_at ? new Date(currentUser.created_at).getFullYear().toString() : "2023",
          isVipActive: currentUser.is_vip === "Y" || currentUser.is_vip === "TRUE" || currentUser.is_vip === true,
        }

        setUserData(transformedUser)
        setUserId(currentUserId)

        // Cache the transformed data
        localStorage.setItem(AUTH_STORAGE_KEY, currentUserId)
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(transformedUser))

        console.log(`🔐 useAuth synced with global store: ${currentUserId}`, transformedUser.full_name)
      } else if (!currentUserId) {
        // Clear local state if no user in global store
        setUserData(null)
        setUserId(null)
      }
    })

    return unsubscribe
  }, [])

  // Load user ID and data from localStorage or URL on mount
  useEffect(() => {
    const cachedUserId = localStorage.getItem(AUTH_STORAGE_KEY)
    const cachedUserData = localStorage.getItem(USER_DATA_STORAGE_KEY)

    if (urlUserId && urlUserId !== userId) {
      // URL has priority - let global store handle the API call
      console.log(`🔐 URL user detected: ${urlUserId}, letting global store handle it`)
      localStorage.setItem(AUTH_STORAGE_KEY, urlUserId)
      setUserId(urlUserId)

      // Don't call API directly - global store will handle it
      // Just trigger global store to check URL
      globalDataStore.checkAndLoadUserFromUrl()
    } else if (cachedUserId && cachedUserData && !urlUserId) {
      // Use cached user ID and data only if no URL user
      if (cachedUserId !== userId) {
        setUserId(cachedUserId)
      }
      try {
        const parsedUserData = JSON.parse(cachedUserData)
        if (userData !== parsedUserData) {
          setUserData(parsedUserData)
        }
        console.log(`🔐 User loaded from cache: ${cachedUserId}`, parsedUserData.full_name)
      } catch (error) {
        console.error("Error parsing cached user data:", error)
        // Clear corrupted cache
        localStorage.removeItem(USER_DATA_STORAGE_KEY)
      }
    } else if (!urlUserId && !cachedUserId) {
      // No user found
      if (userId !== null) {
        setUserId(null)
      }
      if (userData !== null) {
        setUserData(null)
      }
      console.log("🔐 No user found")
    }
  }, [urlUserId])

  useEffect(() => {
    // Set loading to false once we've processed the initial state
    const timer = setTimeout(() => {
      setLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [userId])

  const login = useCallback((newUserId: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, newUserId)
    setUserId(newUserId)

    // Let global store handle the API call
    globalDataStore.loadCurrentUser(newUserId)
    console.log(`🔐 User login initiated: ${newUserId}`)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(USER_DATA_STORAGE_KEY)
    setUserId(null)
    setUserData(null)
    console.log("🔐 User logged out - cleared all data")

    // Redirect to home without user ID
    router.push("/")
  }, [router])

  const updateUserData = useCallback(
    (updates: Partial<User>) => {
      if (userData) {
        const updatedUser = { ...userData, ...updates }
        setUserData(updatedUser)
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(updatedUser))
        console.log("🔄 User data updated:", updates)
      }
    },
    [userData],
  )

  const refreshUserData = useCallback(() => {
    if (userId) {
      console.log(`🔄 Refreshing user data via global store: ${userId}`)
      globalDataStore.refreshCurrentUser()
    }
  }, [userId])

  const isAuthenticated = Boolean(userId)

  return {
    userId,
    userData,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUserData,
    refreshUserData,
  }
}
