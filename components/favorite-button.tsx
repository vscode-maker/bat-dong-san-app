"use client"

import type React from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavoritesContext } from "@/contexts/favorites-context"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  propertyId: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "outline"
  className?: string
  iconClassName?: string
  onToggle?: (isFavorited: boolean) => void
}

export default function FavoriteButton({
  propertyId,
  size = "sm",
  variant = "ghost",
  className,
  iconClassName,
  onToggle,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isToggling, hasUser, loading } = useFavoritesContext()

  const isCurrentlyFavorite = isFavorite(propertyId)
  const isLoading = isToggling(propertyId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    await toggleFavorite(propertyId)

    // Call callback if provided
    if (onToggle) {
      onToggle(!isCurrentlyFavorite)
    }
  }

  // Size configurations
  const sizeConfig = {
    sm: {
      button: "w-7 h-7",
      icon: "w-3 h-3",
    },
    md: {
      button: "w-8 h-8",
      icon: "w-4 h-4",
    },
    lg: {
      button: "w-10 h-10",
      icon: "w-5 h-5",
    },
  }

  const config = sizeConfig[size]

  return (
    <Button
      size="icon"
      variant={variant}
      disabled={isLoading || loading}
      onClick={handleClick}
      className={cn(
        config.button,
        "rounded-full transition-all duration-200",
        variant === "ghost" && "bg-white/90 hover:bg-white backdrop-blur-sm",
        (isLoading || loading) && "opacity-70",
        !hasUser && "opacity-60", // Slightly dimmed when no user
        className,
      )}
      title={!hasUser ? "Đăng nhập để sử dụng tính năng yêu thích" : undefined}
    >
      <Heart
        className={cn(
          config.icon,
          "transition-all duration-200",
          isCurrentlyFavorite && hasUser ? "fill-red-500 text-red-500 scale-110" : "text-gray-600",
          (isLoading || loading) && "animate-pulse",
          iconClassName,
        )}
      />
    </Button>
  )
}
