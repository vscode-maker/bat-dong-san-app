"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Building2,
  Home,
  MapPin,
  Landmark,
  Heart,
  FileText,
  SearchCheck,
  Handshake,
  Gavel,
  Calendar,
  Ruler,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/contexts/toast-context"
import MobileNavigation from "@/components/mobile-navigation"
import FavoriteButton from "@/components/favorite-button"
import { useSaleProperties, useRentalProperties, useFeaturedProperties } from "@/hooks/useProperties"
import { useNews } from "@/hooks/useNews"
import { useFeaturedProjects } from "@/hooks/useProjects"
import { useUser } from "@/hooks/useUsers"
import Script from "next/script"

// iOS 18 Style Property Types với gradient và shadow đẹp
const propertyTypes = [
  {
    id: "apartment",
    name: "Căn hộ",
    icon: Building2,
    gradient: "from-[#00294d] via-[#003d6b] to-[#004d84]",
    iconBg: "bg-white/20",
    glowColor: "shadow-[#00294d]/40",
  },
  {
    id: "house",
    name: "Nhà phố",
    icon: Home,
    gradient: "from-[#003d6b] via-[#004d84] to-[#0066a3]",
    iconBg: "bg-white/20",
    glowColor: "shadow-[#003d6b]/40",
  },
  {
    id: "villa",
    name: "Biệt thự",
    icon: Landmark,
    gradient: "from-[#004d84] via-[#0066a3] to-[#0080c2]",
    iconBg: "bg-white/20",
    glowColor: "shadow-[#004d84]/40",
  },
  {
    id: "land",
    name: "Đất nền",
    icon: MapPin,
    gradient: "from-[#0066a3] via-[#0080c2] to-[#0099e1]",
    iconBg: "bg-white/20",
    glowColor: "shadow-[#0066a3]/40",
  },
]

// Quick Actions với gradient primary
const quickActions = [
  {
    name: "Ký gởi BDS",
    icon: FileText,
    gradient: "from-[#00294d] to-[#003d6b]",
    shadowColor: "shadow-[#00294d]/25",
    description: "Ký gửi bất động sản",
  },
  {
    name: "Yêu cầu tìm",
    icon: SearchCheck,
    gradient: "from-[#003d6b] to-[#004d84]",
    shadowColor: "shadow-[#003d6b]/25",
    description: "Yêu cầu tìm kiếm",
  },
  {
    name: "Ký gửi",
    icon: Handshake,
    gradient: "from-[#004d84] to-[#0066a3]",
    shadowColor: "shadow-[#004d84]/25",
    description: "Ký gửi dịch vụ",
  },
  {
    name: "Đấu thầu",
    icon: Gavel,
    gradient: "from-[#0066a3] to-[#0080c2]",
    shadowColor: "shadow-[#0066a3]/25",
    description: "Đấu thầu dự án",
  },
]

// Company and App Feature Slides Data
const companySlides = [
  {
    id: 1,
    title: "Nền tảng BDS hàng đầu Việt Nam",
    subtitle: "Kết nối mọi nhu cầu bất động sản",
    description: "Với hơn 10 năm kinh nghiệm, chúng tôi là cầu nối tin cậy giữa người mua, bán và thuê bất động sản",
    image: "/placeholder.svg?height=144&width=400&text=Nền+tảng+BDS",
    gradient: "from-[#00294d]/90 to-[#003d6b]/70",
    icon: "🏢",
  },
  {
    id: 2,
    title: "Tìm kiếm thông minh AI",
    subtitle: "Công nghệ tiên tiến nhất",
    description: "Hệ thống AI giúp tìm kiếm bất động sản phù hợp với nhu cầu và ngân sách của bạn chỉ trong vài giây",
    image: "/placeholder.svg?height=144&width=400&text=AI+Search",
    gradient: "from-[#003d6b]/90 to-[#004d84]/70",
    icon: "🤖",
  },
  {
    id: 3,
    title: "Thẩm định giá chuyên nghiệp",
    subtitle: "Minh bạch - Chính xác - Nhanh chóng",
    description: "Đội ngũ chuyên gia thẩm định giá với kinh nghiệm 15+ năm, đảm bảo giá trị đầu tư tối ưu",
    image: "/placeholder.svg?height=144&width=400&text=Thẩm+định+giá",
    gradient: "from-[#004d84]/90 to-[#0066a3]/70",
    icon: "💰",
  },
  {
    id: 4,
    title: "Hỗ trợ vay vốn 24/7",
    subtitle: "Lãi suất ưu đãi - Thủ tục nhanh gọn",
    description: "Kết nối với 20+ ngân hàng hàng đầu, hỗ trợ vay lên đến 85% giá trị bất động sản",
    image: "/placeholder.svg?height=144&width=400&text=Hỗ+trợ+vay",
    gradient: "from-[#0066a3]/90 to-[#0080c2]/70",
    icon: "🏦",
  },
  {
    id: 5,
    title: "Pháp lý an toàn 100%",
    subtitle: "Đội ngũ luật sư chuyên nghiệp",
    description: "Kiểm tra pháp lý toàn diện, đảm bảo giao dịch an toàn và minh bạch cho mọi khách hàng",
    image: "/placeholder.svg?height=144&width=400&text=Pháp+lý",
    gradient: "from-[#0080c2]/90 to-[#0099e1]/70",
    icon: "⚖️",
  },
]

export default function HomeContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [projectFavorites, setProjectFavorites] = useState<number[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const { warning } = useToast()

  // Get user ID from URL params or localStorage
  useEffect(() => {
    const urlUserId = searchParams.get("id")
    const storedUserId = localStorage.getItem("userId")

    if (urlUserId) {
      // If URL has user ID, save it to localStorage and use it
      localStorage.setItem("userId", urlUserId)
      setUserId(urlUserId)
    } else if (storedUserId) {
      // If no URL param but localStorage has user ID, use stored one
      setUserId(storedUserId)
    } else {
      // No user ID found, user is guest
      setUserId(null)
    }
  }, [searchParams])

  const isGuest = !userId

  // Fetch properties từ AppSheet API
  const { properties: saleProperties, loading: loadingSale } = useSaleProperties()
  const { properties: rentalProperties, loading: loadingRental } = useRentalProperties()
  const { properties: featuredProperties, loading: loadingFeatured } = useFeaturedProperties(10)

  // Fetch news từ AppSheet API
  const { news: newsData, loading: loadingNews, error: newsError } = useNews(5)

  // Fetch projects từ AppSheet API
  const { projects: featuredProjectsData, loading: loadingProjects, error: projectsError } = useFeaturedProjects(4)

  // Fetch user data - only if not guest
  const { user: currentUser, loading: loadingUser } = useUser(userId || "")

  const toggleProjectFavorite = (projectId: string) => {
    if (isGuest) {
      warning("Yêu cầu đăng nhập", "Vui lòng đăng nhập để sử dụng tính năng yêu thích")
      return
    }

    const numId = Number.parseInt(projectId)
    setProjectFavorites((prev) => (prev.includes(numId) ? prev.filter((id) => id !== numId) : [...prev, numId]))
  }

  // Auto-advance slideshow
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % companySlides.length)
    }, 10000) // 10 seconds

    return () => clearInterval(slideInterval)
  }, [])

  // Force chat widget positioning after load
  useEffect(() => {
    const adjustChatWidget = () => {
      // Wait for chat widget to load
      setTimeout(() => {
        const chatElements = document.querySelectorAll('[id*="smax"], [class*="smax"], [id*="chat"], [class*="chat"]')
        chatElements.forEach((element) => {
          if (element instanceof HTMLElement) {
            element.style.zIndex = "99999"
            element.style.position = "fixed"
            if (element.style.bottom && element.style.bottom !== "auto") {
              element.style.bottom = "100px"
            }
          }
        })
      }, 2000)
    }

    adjustChatWidget()
    // Re-adjust periodically in case widget reloads
    const interval = setInterval(adjustChatWidget, 5000)
    return () => clearInterval(interval)
  }, [])

  // Render loading skeleton
  const renderPropertySkeleton = () => (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex-shrink-0 w-[160px]">
          <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="w-full h-32 bg-gray-200 animate-pulse"></div>
            <CardContent className="p-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )

  // Render news skeleton
  const renderNewsSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-sm">
          <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )

  // Render projects skeleton
  const renderProjectsSkeleton = () => (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex-shrink-0 w-[280px]">
          <Card className="overflow-hidden bg-white border-0 shadow-lg">
            <Skeleton className="w-full h-48" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-6 w-20 mb-3" />
              <div className="space-y-2 mb-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )

  // Render property card
  const renderPropertyCard = (property: any, isRental = false) => (
    <div key={property.id} className="flex-shrink-0 w-[160px]">
      <Link href={`/property/${property.id}${userId ? `?id=${userId}` : ""}`}>
        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer primary-card">
          <div className="relative">
            <div className="w-full h-32 bg-gray-200 relative overflow-hidden rounded-t-lg">
              <Image src={property.image || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
            </div>

            {/* Use FavoriteButton component */}
            <div className="absolute top-2 right-2 z-10">
              <FavoriteButton userId={userId} propertyId={property.id} size="sm" variant="ghost" />
            </div>

            <div
              className={`absolute bottom-2 left-2 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold ${
                isRental
                  ? "bg-gradient-to-r from-green-600 to-green-700"
                  : "bg-gradient-to-r from-[#00294d] to-[#003d6b]"
              }`}
            >
              {property.priceText}
            </div>
          </div>
          <CardContent className="p-3">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 h-10 leading-tight">{property.title}</h3>
            <div className="flex items-center text-gray-500 text-xs mb-2">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
            <div className="flex gap-2 text-xs text-gray-600">
              <span>{property.area}m²</span>
              {property.bedrooms > 0 && <span>• {property.bedrooms} PN</span>}
              {property.bathrooms > 0 && <span>• {property.bathrooms} WC</span>}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      {/* Compact Header - Always Fixed */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50 gradient-primary backdrop-blur-xl border-b border-white/20 py-3 shadow-lg">
        <div className="px-4">
          {/* Header Layout - Logo left, User + Search right */}
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Image src="/images/logo.png" alt="Logo" width={100} height={32} className="h-7 w-auto" />
            </div>

            {/* Right: Search + User Info */}
            <div className="flex items-center gap-2">
              {/* Search Icon */}
              <Link href={`/search${userId ? `?id=${userId}` : ""}`}>
                <Button
                  size="sm"
                  className="w-9 h-9 btn-gradient-primary hover:btn-gradient-primary shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-4 h-4 text-white" />
                </Button>
              </Link>

              {/* User Info */}
              <div className="flex items-center gap-2">
                {isGuest ? (
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00294d] to-[#003d6b] flex items-center justify-center">
                      <span className="text-xs font-medium text-white">K</span>
                    </div>
                  </div>
                ) : loadingUser ? (
                  <div className="w-9 h-9 rounded-lg bg-gray-200 animate-pulse"></div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00294d] to-[#003d6b] flex items-center justify-center overflow-hidden">
                      {currentUser?.avatar_url &&
                      currentUser.avatar_url !== "/placeholder.svg?height=80&width=80" &&
                      !currentUser.avatar_url.includes("placeholder") ? (
                        <Image
                          src={currentUser.avatar_url || "/placeholder.svg"}
                          alt={currentUser.full_name || "User"}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            e.currentTarget.style.display = "none"
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement
                            if (fallback) fallback.classList.remove("hidden")
                          }}
                        />
                      ) : null}
                      <span
                        className={`text-xs font-medium text-white ${
                          currentUser?.avatar_url &&
                          currentUser.avatar_url !== "/placeholder.svg?height=80&width=80" &&
                          !currentUser.avatar_url.includes("placeholder")
                            ? "hidden"
                            : ""
                        }`}
                      >
                        {currentUser?.full_name ? currentUser.full_name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content with fixed top padding */}
      <div className="pt-20">
        {/* iOS 18 Style Property Types */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex justify-between px-1 mb-3">
            {propertyTypes.map((type) => (
              <Link key={type.id} href={`/search?propertyType=${type.id}${userId ? `&id=${userId}` : ""}`}>
                <div className="flex flex-col items-center min-w-[70px] group">
                  {/* iOS 18 Style Icon Container */}
                  <div className="relative mb-1.5">
                    {/* Main Icon Container */}
                    <div
                      className={`
              relative w-12 h-12 rounded-xl bg-gradient-to-br ${type.gradient} 
              flex items-center justify-center 
              transform transition-all duration-300 
              group-hover:scale-110 group-active:scale-95
            `}
                    >
                      {/* Icon Background */}
                      <div className="rounded-lg p-1.5">
                        {type.icon && <type.icon className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                  </div>

                  {/* Label */}
                  <span className="text-[10px] text-gray-700 text-center font-medium group-hover:text-[#00294d] transition-colors leading-tight">
                    {type.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Company & App Features Slideshow */}
        <div className="px-4 mb-5">
          <div className="relative h-32 rounded-xl overflow-hidden">
            {companySlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 transform translate-x-0"
                    : index < currentSlide
                      ? "opacity-0 transform -translate-x-full"
                      : "opacity-0 transform translate-x-full"
                }`}
              >
                <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} flex items-center`}>
                  <div className="p-4 text-white flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{slide.icon}</span>
                      <p className="text-xs opacity-90 font-medium">{slide.subtitle}</p>
                    </div>
                    <h3 className="font-bold text-sm mb-1 leading-tight">{slide.title}</h3>
                    <p className="text-xs opacity-80 leading-relaxed line-clamp-2">{slide.description}</p>
                  </div>

                  {/* Slide Indicators */}
                  <div className="absolute bottom-3 right-4 flex gap-1">
                    {companySlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions - Horizontal Scroll */}
        <div className="px-4 mb-5">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`
        flex-shrink-0 relative group cursor-pointer 
        transform transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]
      `}
              >
                <div
                  className={`
          w-28 h-10 rounded-xl bg-gradient-to-br ${action.gradient} 
          shadow-sm ${action.shadowColor} hover:shadow-md
          flex items-center justify-center px-2 py-1.5
          backdrop-blur-sm border border-white/20
          transition-all duration-300
        `}
                >
                  {/* Icon và Text cùng hàng */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      {action.icon && <action.icon className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-white text-[10px] font-medium whitespace-nowrap">{action.name}</span>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white/30 rounded-full"></div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Properties for Sale - Horizontal scroll with 2.5 items visible */}
        <div className="px-4 mb-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">
              BDS mua bán {!loadingSale && saleProperties.length > 0 && `(${saleProperties.length})`}
            </h2>
            <Link
              href={`/search?transactionType=sale${userId ? `&id=${userId}` : ""}`}
              className="text-[#00294d] text-sm font-medium hover:text-[#003d6b] transition-colors"
            >
              Xem tất cả
            </Link>
          </div>
          {loadingSale ? (
            renderPropertySkeleton()
          ) : saleProperties.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {saleProperties.slice(0, 10).map((property) => renderPropertyCard(property, false))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Chưa có bất động sản bán nào</p>
            </div>
          )}
        </div>

        {/* Properties for Rent - Horizontal scroll with 2.5 items visible */}
        <div className="px-4 mb-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">
              BDS cho thuê {!loadingRental && rentalProperties.length > 0 && `(${rentalProperties.length})`}
            </h2>
            <Link
              href={`/search?transactionType=rent${userId ? `&id=${userId}` : ""}`}
              className="text-[#00294d] text-sm font-medium hover:text-[#003d6b] transition-colors"
            >
              Xem tất cả
            </Link>
          </div>
          {loadingRental ? (
            renderPropertySkeleton()
          ) : rentalProperties.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {rentalProperties.slice(0, 10).map((property) => renderPropertyCard(property, true))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Chưa có bất động sản cho thuê nào</p>
            </div>
          )}
        </div>

        {/* Featured Projects - Sử dụng dữ liệu từ API */}
        <div className="px-4 mb-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Dự án nổi bật {!loadingProjects && featuredProjectsData.length > 0 && `(${featuredProjectsData.length})`}
            </h2>
            <Link
              href={`/projects${userId ? `?id=${userId}` : ""}`}
              className="text-[#00294d] text-sm font-medium hover:text-[#003d6b] transition-colors"
            >
              Tất cả
            </Link>
          </div>

          {/* Loading State */}
          {loadingProjects && renderProjectsSkeleton()}

          {/* Error State */}
          {projectsError && !loadingProjects && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Không thể tải dự án</p>
              <p className="text-gray-500 text-sm">Vui lòng thử lại sau</p>
            </div>
          )}

          {/* Projects Content */}
          {!loadingProjects && !projectsError && (
            <>
              {featuredProjectsData.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {featuredProjectsData.map((project) => (
                    <div key={project.id} className="flex-shrink-0 w-[280px]">
                      <Link href={`/project/${project.id}${userId ? `?id=${userId}` : ""}`}>
                        <Card className="overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                          <div className="relative">
                            {/* Project Image */}
                            <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
                              <Image
                                src={project.image || "/placeholder.svg"}
                                alt={project.title}
                                fill
                                className="object-cover"
                              />

                              {/* Badge */}
                              <div
                                className={`absolute top-3 left-3 ${project.badgeColor} text-white px-2 py-1 rounded-md text-xs font-bold`}
                              >
                                {project.badge}
                              </div>

                              {/* Heart Icon */}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-8 h-8 p-0 z-10"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  toggleProjectFavorite(project.id)
                                }}
                              >
                                <Heart
                                  className={`w-4 h-4 ${
                                    projectFavorites.includes(Number.parseInt(project.id))
                                      ? "fill-red-500 text-red-500"
                                      : "text-gray-600"
                                  }`}
                                />
                              </Button>
                            </div>
                          </div>

                          <CardContent className="p-4">
                            {/* Project Title */}
                            <h3 className="font-bold text-sm mb-2 line-clamp-2 leading-tight">{project.title}</h3>

                            {/* Price */}
                            <div className="mb-3">
                              <div className="text-lg font-bold text-red-600">{project.priceText}</div>
                              <div className="text-xs text-red-500">{project.status}</div>
                            </div>

                            {/* Project Details */}
                            <div className="space-y-2 text-xs text-gray-600 mb-3">
                              <div className="flex items-center gap-2">
                                <Ruler className="w-3 h-3 text-gray-400" />
                                <span>{(project.area / 10000).toFixed(1)} ha</span>
                                <Building className="w-3 h-3 text-gray-400 ml-2" />
                                <span>{project.units.toLocaleString()} căn</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span>{project.launch_date}</span>
                              </div>
                            </div>

                            {/* Location */}
                            <div className="pt-2 border-t border-gray-100">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                  {project.location}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có dự án nào</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* News Section - Sử dụng dữ liệu từ API */}
        <div className="px-4 mb-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Tin tức bất động sản {!loadingNews && newsData.length > 0 && `(${newsData.length})`}
            </h2>
            <Link
              href={`/news${userId ? `?id=${userId}` : ""}`}
              className="text-[#00294d] text-sm font-medium hover:text-[#003d6b] transition-colors"
            >
              Xem tất cả
            </Link>
          </div>

          {/* Loading State */}
          {loadingNews && renderNewsSkeleton()}

          {/* Error State */}
          {newsError && !loadingNews && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Không thể tải tin tức</p>
              <p className="text-gray-500 text-sm">Vui lòng thử lại sau</p>
            </div>
          )}

          {/* News Content */}
          {!loadingNews && !newsError && (
            <>
              {newsData.length > 0 ? (
                <div className="space-y-3">
                  {newsData.map((news) => (
                    <Link key={news.id} href={`/news/${news.id}${userId ? `?id=${userId}` : ""}`}>
                      <div className="flex gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-sm hover:shadow-md transition-all cursor-pointer primary-card mb-2.5">
                        <Image
                          src={news.featured_image || "/placeholder.svg"}
                          alt={news.title}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-gray-900 leading-relaxed">
                            {news.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-1 leading-relaxed">{news.excerpt}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có tin tức nào</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Chat Widget Scripts */}
      <Script id="smax-chat-init" strategy="afterInteractive">
        {`
          window.smAsyncInit = function () {
            SM.init({
              page_pid: 'ctm68597cf254724e441aee848c',
              trigger_id: '685980055f3265507a7f9e15',
              chat_type: 'PLUGIN',
              env: 'prod'
            })
          }
        `}
      </Script>
      <Script src="https://chatbox.smax.ai/sdk.min.js" strategy="afterInteractive" />

      {/* Enhanced CSS để đảm bảo chat widget cao hơn footer */}
      <style jsx global>{`
        /* Force chat widget positioning with highest priority */
        * [id*="smax"],
        * [class*="smax"],
        * [id*="chat"],
        * [class*="chat"],
        div[style*="position: fixed"] {
          z-index: 99999 !important;
        }
        
        /* Specific targeting for common chat widget patterns */
        div[style*="bottom"][style*="right"],
        div[style*="position: fixed"][style*="bottom"] {
          z-index: 99999 !important;
          bottom: 100px !important;
        }
        
        /* Override any inline styles */
        [style*="z-index"] {
          z-index: 99999 !important;
        }
        
        /* Ensure footer doesn't interfere */
        .fixed.bottom-0 {
          z-index: 50 !important;
        }
      `}</style>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
        <div className="gradient-primary backdrop-blur-xl border-t border-white/20 shadow-lg">
          <MobileNavigation />
        </div>
      </div>
    </div>
  )
}
