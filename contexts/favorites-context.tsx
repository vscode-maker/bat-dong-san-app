"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useToast } from "@/contexts/toast-context"
import { useAuth } from "@/hooks/useAuth"
import { DataService } from "@/lib/data-service"

interface FavoritesContextType {
  favorites: Set<string>
  loading: boolean
  error: string | null
  hasUser: boolean
  currentUserId: string | null
  isFavorite: (propertyId: string) => boolean
  toggleFavorite: (propertyId: string) => Promise<void>
  isToggling: (propertyId: string) => boolean
  refetch: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { userId, loading: authLoading } = useAuth()

  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

  const hasUser = Boolean(userId)
  const currentUserId = userId

  const { warning, success, error: showError } = useToast()

  const fetchFavorites = useCallback(async () => {
    if (!userId || authLoading) {
      setFavorites(new Set())
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log(`🔄 Fetching favorites for user: ${userId}`)

      // Use DataService which now calls AppSheet with Filter
      const favoritesData = await DataService.getUserFavorites(userId)

      // Extract property IDs from favorites
      const favoriteIds = favoritesData.map((fav: any) => fav.property_id).filter(Boolean)

      setFavorites(new Set(favoriteIds))
      console.log(`✅ Loaded ${favoriteIds.length} favorites for user: ${userId}`, favoriteIds)
    } catch (err) {
      console.error("❌ Error fetching favorites:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch favorites")
    } finally {
      setLoading(false)
    }
  }, [userId, authLoading])

  useEffect(() => {
    if (!authLoading) {
      fetchFavorites()
    }
  }, [fetchFavorites, authLoading])

  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      if (!userId) {
        warning("Yêu cầu đăng nhập", "Vui lòng thêm ?id=YOUR_ID vào URL để đăng nhập")
        return
      }

      try {
        setTogglingIds((prev) => new Set(prev).add(propertyId))

        const isFavorited = favorites.has(propertyId)
        console.log(`${isFavorited ? "💔" : "❤️"} ${isFavorited ? "Removing" : "Adding"} favorite: ${propertyId}`)

        // Use DataService which calls AppSheet API
        const newIsFavorited = await DataService.toggleFavorite(userId, propertyId)

        // Update local state
        setFavorites((prev) => {
          const newFavorites = new Set(prev)
          if (newIsFavorited) {
            newFavorites.add(propertyId)
          } else {
            newFavorites.delete(propertyId)
          }
          return newFavorites
        })

        const message = newIsFavorited ? "Đã thêm vào yêu thích" : "Đã bỏ yêu thích"
        success("Thành công", message)
        console.log(`✅ ${message}: ${propertyId}`)
      } catch (err) {
        console.error("❌ Error toggling favorite:", err)
        showError("Lỗi", err instanceof Error ? err.message : "Không thể cập nhật yêu thích")
      } finally {
        setTogglingIds((prev) => {
          const newSet = new Set(prev)
          newSet.delete(propertyId)
          return newSet
        })
      }
    },
    [userId, favorites, warning, success, showError],
  )

  const isToggling = useCallback(
    (propertyId: string) => {
      return togglingIds.has(propertyId)
    },
    [togglingIds],
  )

  const isFavorite = useCallback((propertyId: string) => favorites.has(propertyId), [favorites])

  const value: FavoritesContextType = {
    favorites,
    loading,
    error,
    hasUser,
    currentUserId,
    isFavorite,
    toggleFavorite,
    isToggling,
    refetch: fetchFavorites,
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavoritesContext must be used within a FavoritesProvider")
  }
  return context
}
