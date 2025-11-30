"use client"

import { useState, useEffect } from "react"

interface UseFavoriteStatusProps {
  userId: string | null
  propertyId: string
}

export function useFavoriteStatus({ userId, propertyId }: UseFavoriteStatusProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!userId || !propertyId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/favorites?userId=${userId}`)
        const result = await response.json()

        if (result.success) {
          const favorites = result.data || []
          const isFav = favorites.some((fav: any) => fav.id === propertyId)
          setIsFavorite(isFav)
        }
      } catch (error) {
        console.error("Error checking favorite status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkFavoriteStatus()
  }, [userId, propertyId])

  return {
    isFavorite,
    loading,
    setIsFavorite, // For manual updates
  }
}
