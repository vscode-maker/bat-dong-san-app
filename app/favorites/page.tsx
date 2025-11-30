"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, MapPin, Trash2, RotateCcw, Loader2, GitCompare, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import MobileNavigation from "@/components/mobile-navigation"
import { useFavoritesContext } from "@/contexts/favorites-context"
import { useProperties } from "@/hooks/useProperties"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/contexts/toast-context"
import SafeImage from "@/components/safe-image"

export default function FavoritesPage() {
  const { userId, loading: authLoading } = useAuth()
  const {
    favorites,
    loading: favoritesLoading,
    error: favoritesError,
    hasUser,
    toggleFavorite,
    isToggling,
  } = useFavoritesContext()
  const { properties, loading: propertiesLoading } = useProperties()
  const { success, warning } = useToast()
  const router = useRouter()

  const [removingIds, setRemovingIds] = useState<string[]>([])
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState<Set<string>>(new Set())

  // Filter properties to get only favorited ones
  const favoriteProperties = properties.filter((property) => favorites.has(property.id))

  const handleRemoveFavorite = async (propertyId: string) => {
    if (!hasUser) return

    try {
      setRemovingIds((prev) => [...prev, propertyId])
      await toggleFavorite(propertyId)
      success("Thành công", "Đã bỏ yêu thích")
    } catch (error) {
      console.error("Error removing favorite:", error)
    } finally {
      setRemovingIds((prev) => prev.filter((id) => id !== propertyId))
    }
  }

  const toggleCompareSelection = (propertyId: string) => {
    setSelectedForCompare((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId)
      } else {
        if (newSet.size >= 4) {
          warning("Giới hạn so sánh", "Chỉ có thể so sánh tối đa 4 bất động sản cùng lúc")
          return prev
        }
        newSet.add(propertyId)
      }
      return newSet
    })
  }

  const startCompare = () => {
    if (selectedForCompare.size < 2) {
      warning("Chọn ít nhất 2 BDS", "Vui lòng chọn ít nhất 2 bất động sản để so sánh")
      return
    }

    // Save selected properties to localStorage for compare page
    const selectedProperties = favoriteProperties.filter((p) => selectedForCompare.has(p.id))
    localStorage.setItem("compareList", JSON.stringify(selectedProperties))

    success("Chuyển đến so sánh", `Đang so sánh ${selectedForCompare.size} bất động sản`)
    router.push(`/compare${userId ? `?id=${userId}` : ""}`)
  }

  const exitCompareMode = () => {
    setCompareMode(false)
    setSelectedForCompare(new Set())
  }

  // Guest user handling
  if (!hasUser && !authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white border-b p-4 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tin yêu thích</h1>
            <p className="text-sm text-gray-600">Danh sách bất động sản đã lưu</p>
          </div>
        </header>

        <div className="p-4 text-center space-y-6">
          <div className="py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Đăng nhập để xem yêu thích</h3>
            <p className="text-sm text-gray-600 mb-6">Bạn cần đăng nhập để lưu và xem danh sách tin yêu thích</p>
            <Button className="bg-gradient-to-r from-[#00294d] to-[#003d6b] hover:from-[#003d6b] hover:to-[#004d84] text-white font-semibold py-3 px-6 rounded-xl shadow-lg">
              Đăng nhập ngay
            </Button>
          </div>
        </div>

        <MobileNavigation />
      </div>
    )
  }

  // Loading state
  if (favoritesLoading || propertiesLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white border-b p-4 flex items-center gap-3">
          <Link href={`/${userId ? `?id=${userId}` : ""}`}>
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tin yêu thích</h1>
            <p className="text-sm text-gray-600">Đang tải...</p>
          </div>
        </header>

        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="overflow-hidden bg-white border-0 shadow-sm">
              <div className="flex gap-4 p-4">
                <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <MobileNavigation />
      </div>
    )
  }

  // Error state
  if (favoritesError) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white border-b p-4 flex items-center gap-3">
          <Link href={`/${userId ? `?id=${userId}` : ""}`}>
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tin yêu thích</h1>
            <p className="text-sm text-gray-600">Có lỗi xảy ra</p>
          </div>
        </header>

        <div className="p-4 text-center space-y-4">
          <div className="py-12">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không thể tải danh sách yêu thích</h3>
            <p className="text-sm text-gray-600 mb-6">{favoritesError}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#00294d] to-[#003d6b] hover:from-[#003d6b] hover:to-[#004d84] text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </div>

        <MobileNavigation />
      </div>
    )
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/${userId ? `?id=${userId}` : ""}`}>
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tin yêu thích</h1>
              <p className="text-sm text-gray-600">
                {favoriteProperties.length > 0
                  ? `${favoriteProperties.length} bất động sản đã lưu`
                  : "Danh sách bất động sản đã lưu"}
              </p>
            </div>
          </div>

          {favoriteProperties.length >= 2 && (
            <div className="flex gap-2">
              {!compareMode ? (
                <Button
                  onClick={() => setCompareMode(true)}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <GitCompare className="w-4 h-4 mr-1" />
                  So sánh
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={exitCompareMode} variant="ghost" size="sm">
                    Hủy
                  </Button>
                  <Button
                    onClick={startCompare}
                    disabled={selectedForCompare.size < 2}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <GitCompare className="w-4 h-4 mr-1" />
                    So sánh ({selectedForCompare.size})
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {compareMode && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Chế độ so sánh</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {selectedForCompare.size}/4
                </Badge>
              </div>
              <p className="text-xs text-blue-700">Chọn 2-4 bất động sản để so sánh</p>
            </div>
          </div>
        )}
      </header>

      <div className="p-4">
        {favoriteProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có tin yêu thích</h3>
            <p className="text-sm text-gray-600 mb-6">Hãy khám phá và lưu những bất động sản bạn quan tâm</p>
            <Link href={`/${userId ? `?id=${userId}` : ""}`}>
              <Button className="bg-gradient-to-r from-[#00294d] to-[#003d6b] hover:from-[#003d6b] hover:to-[#004d84] text-white font-semibold py-3 px-6 rounded-xl shadow-lg">
                Khám phá ngay
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteProperties.map((property) => (
              <Card
                key={property.id}
                className={`overflow-hidden bg-white border-0 shadow-sm hover:shadow-md transition-all ${
                  compareMode && selectedForCompare.has(property.id) ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
              >
                <div className="flex gap-4 p-4">
                  {compareMode && (
                    <div className="flex-shrink-0 flex items-center">
                      <Checkbox
                        checked={selectedForCompare.has(property.id)}
                        onCheckedChange={() => toggleCompareSelection(property.id)}
                        className="w-5 h-5"
                      />
                    </div>
                  )}

                  <Link href={`/property/${property.id}${userId ? `?id=${userId}` : ""}`} className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                      <SafeImage
                        src={
                          property.image ||
                          property.images?.[0] ||
                          "/placeholder.svg?height=96&width=96&query=real-estate"
                        }
                        alt={property.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/property/${property.id}${userId ? `?id=${userId}` : ""}`}>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-[#00294d] transition-colors">
                        {property.title}
                      </h3>
                    </Link>

                    <div className="text-lg font-bold text-red-600 mb-2">{property.priceText}</div>

                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>

                    <div className="flex gap-3 text-sm text-gray-600 mb-2">
                      <span>{property.area}m²</span>
                      {property.bedrooms > 0 && <span>• {property.bedrooms} PN</span>}
                      {property.bathrooms > 0 && <span>• {property.bathrooms} WC</span>}
                    </div>

                    <div className="text-xs text-gray-400">Loại: {property.type === "sale" ? "Bán" : "Cho thuê"}</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {compareMode && selectedForCompare.has(property.id) && (
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-xs font-bold">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    {!compareMode && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2"
                        onClick={() => handleRemoveFavorite(property.id)}
                        disabled={removingIds.includes(property.id) || isToggling(property.id)}
                      >
                        {removingIds.includes(property.id) || isToggling(property.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <MobileNavigation />
    </div>
  )
}
