"use client"

import { useState } from "react"
import { useToast } from "@/contexts/toast-context"

interface UseFavoriteToggleProps {
  userId: string | null
  propertyId: string
  initialIsFavorite?: boolean
  onToggle?: (isFavorited: boolean) => void
}

export function useFavoriteToggle({ userId, propertyId, initialIsFavorite = false, onToggle }: UseFavoriteToggleProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const { success, error: showError, warning } = useToast()

  const toggleFavorite = async () => {
    // Check if user is logged in
    if (!userId) {
      warning("Yêu cầu đăng nhập", "Vui lòng đăng nhập để sử dụng tính năng yêu thích")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          propertyId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        const newIsFavorite = result.data.isFavorited
        setIsFavorite(newIsFavorite)

        // Show success message
        success("Thành công", result.data.message)

        // Call callback if provided
        if (onToggle) {
          onToggle(newIsFavorite)
        }
      } else {
        showError("Lỗi", result.error || "Không thể cập nhật yêu thích")
      }
    } catch (err) {
      console.error("Error toggling favorite:", err)
      showError("Lỗi", "Không thể kết nối đến server")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isFavorite,
    isLoading,
    toggleFavorite,
    setIsFavorite, // For manual updates
  }
}
