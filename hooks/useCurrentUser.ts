"use client"

import { useState, useEffect } from "react"

// Mock user data - sau này sẽ thay bằng real authentication
interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      // Mock user - uncomment để test với user có sẵn
      // setUser({
      //   id: "user-123",
      //   name: "Nguyễn Văn A",
      //   email: "user@example.com",
      //   avatar_url: "/placeholder.svg?height=40&width=40"
      // })

      // Để null để test trường hợp không có user
      setUser(null)
      setLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return { user, loading }
}
