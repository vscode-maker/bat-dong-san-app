"use client"

import { useState, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import {
  ArrowLeft,
  Share2,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Ruler,
  Bed,
  Bath,
  Car,
  Shield,
  Copy,
  Facebook,
  MessageSquare,
  Mail,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProperty, useProperties } from "@/hooks/useProperties"
import FavoriteButton from "@/components/favorite-button"
import { useSearchParams } from "next/navigation"

function PropertyDetailPageContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get("id") // Get user ID from URL params

  const { property, loading, error } = useProperty(params.id)
  const { properties: nearbyProperties } = useProperties({
    district: property?.district,
  })

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="animate-pulse">
          <div className="aspect-video bg-gray-300" />
          <div className="p-4 space-y-4">
            <div className="h-8 bg-gray-300 rounded w-3/4" />
            <div className="h-6 bg-gray-300 rounded w-1/2" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-300 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bất động sản</h1>
          <p className="text-gray-600 mb-6">Bất động sản này có thể đã được gỡ bỏ hoặc không tồn tại.</p>
          <Link href="/search">
            <Button>Quay lại tìm kiếm</Button>
          </Link>
        </div>
      </div>
    )
  }

  const propertyUrl = typeof window !== "undefined" ? `${window.location.origin}/property/${property.id}` : ""
  const shareText = `${property.title} - ${property.priceText} tại ${property.location}`

  // Filter nearby properties (exclude current property and limit to 5)
  const filteredNearbyProperties = nearbyProperties?.filter((p) => p.id !== property.id)?.slice(0, 5) || []

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(propertyUrl)
    const encodedText = encodeURIComponent(shareText)

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank")
        break
      case "zalo":
        window.open(`https://zalo.me/share?url=${encodedUrl}&text=${encodedText}`, "_blank")
        break
      case "email":
        window.open(`mailto:?subject=${encodedText}&body=Xem chi tiết tại: ${propertyUrl}`)
        break
      case "copy":
        navigator.clipboard.writeText(propertyUrl).then(() => {
          alert("Đã sao chép link!")
          setShowShareModal(false)
        })
        break
    }
  }

  // Helper function to safely display values
  const safeDisplay = (value: any, fallback = "") => {
    if (value === null || value === undefined || value === "" || value === 0) {
      return fallback
    }
    return value
  }

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      return new Date(dateString).toLocaleDateString("vi-VN")
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={property.images[currentImageIndex] || property.image || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover"
          />

          {/* Back Button - Top Left */}
          <div className="absolute top-4 left-4 z-20">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full w-10 h-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>

          {/* Favorite & Share Buttons - Top Right */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <FavoriteButton
              userId={userId}
              propertyId={property.id}
              size="lg"
              variant="ghost"
              className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white"
              iconClassName="text-white"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowShareModal(true)}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full w-10 h-10"
            >
              <Share2 className="w-5 h-5 text-white" />
            </Button>
          </div>

          {property.images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentImageIndex + 1}/{property.images.length}
            </div>
          )}
        </div>

        {/* Image Thumbnails */}
        {property.images.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  index === currentImageIndex ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Ảnh ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="p-4 space-y-4">
        {/* Price and Title */}
        <div>
          <div className="text-2xl font-bold text-blue-600 mb-2">{property.priceText}</div>
          <h1 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h1>
          {property.location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {property.location}
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {property.area > 0 && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
              <Ruler className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-sm font-semibold">{property.area}m²</div>
                <div className="text-xs text-gray-500">Diện tích</div>
              </div>
            </div>
          )}
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
              <Bed className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-sm font-semibold">{property.bedrooms}</div>
                <div className="text-xs text-gray-500">Phòng ngủ</div>
              </div>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
              <Bath className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-sm font-semibold">{property.bathrooms}</div>
                <div className="text-xs text-gray-500">Phòng tắm</div>
              </div>
            </div>
          )}
          {/* Always show parking even if 0 or empty */}
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
            <Car className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-sm font-semibold">{safeDisplay(property.parking, "Không có")}</div>
              <div className="text-xs text-gray-500">Chỗ đậu xe</div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {property.property_type && (
                <div>
                  <span className="text-gray-500">Loại hình:</span>
                  <span className="ml-2 font-medium">{property.property_type}</span>
                </div>
              )}
              {safeDisplay(property.floor) && (
                <div>
                  <span className="text-gray-500">Số tầng:</span>
                  <span className="ml-2 font-medium">{property.floor} tầng</span>
                </div>
              )}
              {property.direction && (
                <div>
                  <span className="text-gray-500">Hướng nhà:</span>
                  <span className="ml-2 font-medium">{property.direction}</span>
                </div>
              )}
              {property.legal && (
                <div>
                  <span className="text-gray-500">Pháp lý:</span>
                  <span className="ml-2 font-medium text-green-600">{property.legal}</span>
                </div>
              )}
            </div>
            {property.created_at && (
              <>
                <Separator />
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Đăng ngày: {formatDate(property.created_at)}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tabs for Description, Amenities, and Location */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="amenities">Tiện ích</TabsTrigger>
            <TabsTrigger value="location">Vị trí</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="whitespace-pre-line text-sm text-gray-700">
                  {property.description || "Chưa có mô tả chi tiết."}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="amenities" className="mt-4">
            <Card>
              <CardContent className="p-4">
                {property.features && property.features.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">Chưa có thông tin về tiện ích.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="location" className="mt-4 space-y-4">
            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bản đồ vị trí</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p>Bản đồ vị trí</p>
                    {property.location && <p className="text-sm">{property.location}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Properties */}
            {filteredNearbyProperties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bất động sản lân cận</CardTitle>
                  <p className="text-sm text-gray-500">
                    Các bất động sản gần đây tại {property.district || "khu vực này"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredNearbyProperties.map((nearbyProperty) => (
                      <Link
                        key={nearbyProperty.id}
                        href={`/property/${nearbyProperty.id}${userId ? `?id=${userId}` : ""}`}
                      >
                        <div className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-shrink-0">
                            <Image
                              src={nearbyProperty.image || "/placeholder.svg"}
                              alt={nearbyProperty.title}
                              width={80}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                              {nearbyProperty.title}
                            </h4>
                            <div className="text-lg font-bold text-blue-600 mb-1">{nearbyProperty.priceText}</div>
                            {nearbyProperty.location && (
                              <div className="flex items-center text-xs text-gray-500 mb-2">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span className="truncate">{nearbyProperty.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              {nearbyProperty.area > 0 && (
                                <div className="flex items-center gap-1">
                                  <Ruler className="w-3 h-3" />
                                  {nearbyProperty.area}m²
                                </div>
                              )}
                              {nearbyProperty.bedrooms > 0 && (
                                <div className="flex items-center gap-1">
                                  <Bed className="w-3 h-3" />
                                  {nearbyProperty.bedrooms}PN
                                </div>
                              )}
                              {nearbyProperty.bathrooms > 0 && (
                                <div className="flex items-center gap-1">
                                  <Bath className="w-3 h-3" />
                                  {nearbyProperty.bathrooms}PT
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {property.district && (
                    <div className="mt-4 text-center">
                      <Link
                        href={`/search?district=${encodeURIComponent(property.district)}${userId ? `&id=${userId}` : ""}`}
                      >
                        <Button variant="outline" className="w-full">
                          Xem thêm BĐS tại {property.district}
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/placeholder.svg?height=50&width=50&text=Agent"
                alt="Agent"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <div className="font-semibold">Tư vấn viên</div>
                <div className="text-sm text-gray-500">Môi giới bất động sản</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Gọi điện
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                <MessageCircle className="w-4 h-4 mr-2" />
                Nhắn tin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Chia sẻ bất động sản</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowShareModal(false)} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Property Preview */}
                <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 mb-1">{property.title}</h4>
                    <div className="text-blue-600 font-bold">{property.priceText}</div>
                  </div>
                </div>

                {/* Share Options */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleShare("facebook")}
                    className="flex items-center gap-2 h-12"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    Facebook
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleShare("zalo")}
                    className="flex items-center gap-2 h-12"
                  >
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    Zalo
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleShare("email")}
                    className="flex items-center gap-2 h-12"
                  >
                    <Mail className="w-5 h-5 text-gray-600" />
                    Email
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleShare("copy")}
                    className="flex items-center gap-2 h-12"
                  >
                    <Copy className="w-5 h-5 text-gray-600" />
                    Sao chép link
                  </Button>
                </div>

                {/* URL Display */}
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Link chia sẻ:</p>
                  <p className="text-sm text-gray-700 break-all">{propertyUrl}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<PropertyDetailSkeleton />}>
      <PropertyDetailPageContent params={params} />
    </Suspense>
  )
}

function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 animate-pulse">
      <div className="relative h-80 bg-gray-300" />
      <div className="p-4 space-y-4">
        <div className="h-6 w-3/4 bg-gray-300 rounded" />
        <div className="h-8 w-1/3 bg-gray-300 rounded" />
        <div className="h-4 w-1/2 bg-gray-300 rounded" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-300 rounded" />
          ))}
        </div>
        <div className="h-32 bg-gray-300 rounded" />
      </div>
    </div>
  )
}
