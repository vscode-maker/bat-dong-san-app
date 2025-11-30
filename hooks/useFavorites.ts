"use client"

import { useState, useEffect } from "react"
import { DataService } from "@/lib/data-service"

export interface FavoriteProperty {
  id: string
  title: string
  price: string
  location: string
  image?: string
  type: "sale" | "rent"
  area: number
  bedrooms: number
  bathrooms: number
  floor?: number
  direction?: string
  legal?: string
  pricePerM2?: number
  propertyType: string
  yearBuilt?: number
  parking?: number
  savedDate: string
}

export function useFavorites(userId: string) {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFavorites = async () => {
    if (!userId) {
      setFavorites([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data = await DataService.getUserFavorites(userId)
      setFavorites(data)
    } catch (err) {
      console.error("Error fetching favorites:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch favorites")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [userId])

  const removeFavorite = async (propertyId: string) => {
    try {
      await DataService.toggleFavorite(userId, propertyId)
      setFavorites((prev) => prev.filter((item) => item.id !== propertyId))
    } catch (err) {
      console.error("Error removing favorite:", err)
      throw err
    }
  }

  const addFavorite = async (propertyId: string) => {
    try {
      await DataService.toggleFavorite(userId, propertyId)
      // Refresh favorites list
      await fetchFavorites()
    } catch (err) {
      console.error("Error adding favorite:", err)
      throw err
    }
  }

  return {
    favorites,
    loading,
    error,
    removeFavorite,
    addFavorite,
    refetch: fetchFavorites,
  }
}
