"use client"

import { useState } from "react"
import { useMemo } from "react"
import { useAppData } from "@/contexts/data-context"

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  user_type: string
  is_vip: boolean
  is_active: boolean
  avatar_url?: string // Main avatar field
  address?: string
  city?: string
  district?: string
  date_of_birth?: string
  gender?: string
  occupation?: string
  created_at: string
  updated_at: string
  last_login?: string
  total_favorites: number
  total_saved_filters: number
  total_consultations: number
  vip_expires_at?: string
  joinYear?: string
  isVipActive?: boolean
}

// Mock user data for testing
const mockUsers: Record<string, User> = {
  "456": {
    id: "456",
    email: "nguyen.van.a@example.com",
    full_name: "Nguyễn Văn A",
    phone: "0901234567",
    user_type: "customer",
    is_vip: true,
    is_active: true,
    avatar_url: "/placeholder.svg?height=80&width=80",
    address: "123 Đường ABC, Phường XYZ",
    city: "Hồ Chí Minh",
    district: "Quận 1",
    date_of_birth: "1990-05-15",
    gender: "male",
    occupation: "Kỹ sư phần mềm",
    created_at: "2023-01-15T00:00:00Z",
    updated_at: "2024-12-24T00:00:00Z",
    last_login: "2024-12-24T10:30:00Z",
    total_favorites: 12,
    total_saved_filters: 3,
    total_consultations: 5,
    vip_expires_at: "2025-06-15T00:00:00Z",
    joinYear: "2023",
    isVipActive: true,
  },
  "123": {
    id: "123",
    email: "tran.thi.b@example.com",
    full_name: "Trần Thị B",
    phone: "0907654321",
    user_type: "agent",
    is_vip: false,
    is_active: true,
    avatar_url: "/placeholder.svg?height=80&width=80",
    address: "456 Đường DEF, Phường UVW",
    city: "Hà Nội",
    district: "Quận Ba Đình",
    date_of_birth: "1985-08-20",
    gender: "female",
    occupation: "Môi giới bất động sản",
    created_at: "2023-03-10T00:00:00Z",
    updated_at: "2024-12-24T00:00:00Z",
    last_login: "2024-12-23T15:45:00Z",
    total_favorites: 8,
    total_saved_filters: 5,
    total_consultations: 15,
    vip_expires_at: null,
    joinYear: "2023",
    isVipActive: false,
  },
}

export function useUsers() {
  const { getUsers, loading, errors, isInitialized } = useAppData()

  const users = useMemo(() => {
    // Only get users if data is initialized
    if (!isInitialized) {
      return []
    }
    return getUsers()
  }, [getUsers, isInitialized])

  return {
    users,
    loading: loading.users,
    error: errors.users,
    isInitialized,
    refetch: () => {}, // Will be handled by global refresh
  }
}

// Hook to get single user by ID
export function useUser(id: string) {
  const { getUser, loading, errors, isInitialized } = useAppData()

  const user = useMemo(() => {
    // First check mock data for testing
    if (id && mockUsers[id]) {
      console.log(`🧪 Using mock user data for ID: ${id}`)
      return mockUsers[id]
    }

    // Only get user if data is initialized and ID is provided
    if (!isInitialized || !id) {
      return null
    }
    return getUser(id)
  }, [getUser, id, isInitialized])

  return {
    user,
    loading: loading.users && !mockUsers[id || ""], // Don't show loading for mock users
    error: errors.users,
    isInitialized,
    refetch: () => {}, // Will be handled by global refresh
  }
}

// Hook to create user
export function useCreateUser() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createUser = async (userData: Partial<User>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error("Error creating user:", err)
      setError(err instanceof Error ? err.message : "Failed to create user")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createUser, loading, error }
}

// Hook to update user
export function useUpdateUser() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error("Error updating user:", err)
      setError(err instanceof Error ? err.message : "Failed to update user")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateUser, loading, error }
}
