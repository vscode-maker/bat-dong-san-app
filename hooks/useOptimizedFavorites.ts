"use client"

import { useFavoritesContext } from "@/contexts/favorites-context"

/**
 * Simplified hook for property cards that just need to know if a property is favorited
 * and toggle it. This replaces the old useFavoriteStatus and useFavoriteToggle hooks.
 */
export function useOptimizedFavorites(propertyId: string) {
  const { isFavorite, toggleFavorite, isToggling, loading } = useFavoritesContext()

  return {
    isFavorite: isFavorite(propertyId),
    toggleFavorite: () => toggleFavorite(propertyId),
    isLoading: isToggling(propertyId),
    globalLoading: loading, // For initial load state
  }
}
