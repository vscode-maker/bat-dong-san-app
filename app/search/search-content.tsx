"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, SlidersHorizontal, MapPin, Grid, List, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import PropertyCard from "@/components/property-card"
import FilterBottomSheet from "@/components/filter-bottom-sheet"
import MobileNavigation from "@/components/mobile-navigation"
import { useProperties } from "@/hooks/useProperties"

// Property types mapping
const propertyTypeNames = {
  apartment: "Căn hộ/Chung cư",
  house: "Nhà riêng",
  villa: "Biệt thự",
  land: "Đất nền",
  shophouse: "Shophouse",
  office: "Văn phòng",
  warehouse: "Kho/Xưởng",
}

interface FilterState {
  transactionType: "sale" | "rent" | ""
  propertyType: string
  province: string
  district: string
  priceRange: [number, number]
  areaRange: [number, number]
  bedrooms: string[]
  bathrooms: string[]
  direction: string[]
  legal: string[]
}

export default function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [savedFilters, setSavedFilters] = useState<any[]>([])
  const [favorites, setFavorites] = useState<number[]>([])

  // Build filters from URL params using useMemo
  const filters = useMemo(() => {
    const params = {
      search: searchParams.get("q") || searchParams.get("search") || "",
      propertyType: searchParams.get("propertyType") || searchParams.get("type") || "",
      transactionType: (searchParams.get("transactionType") || "") as "sale" | "rent" | "",
      province: searchParams.get("province") || "",
      district: searchParams.get("district") || "",
      minPrice: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
      maxPrice: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
      minArea: searchParams.get("areaMin") ? Number(searchParams.get("areaMin")) : undefined,
      maxArea: searchParams.get("areaMax") ? Number(searchParams.get("areaMax")) : undefined,
      bedrooms: searchParams.get("bedrooms")?.split(",").map(Number) || undefined,
      bathrooms: searchParams.get("bathrooms")?.split(",").map(Number) || undefined,
      direction: searchParams.get("direction")?.split(",") || undefined,
      legal: searchParams.get("legal")?.split(",") || undefined,
    }

    return Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== ""))
  }, [searchParams])

  // Get properties with filters
  const { properties, loading, error } = useProperties(filters)

  useEffect(() => {
    const query = searchParams.get("q") || searchParams.get("search") || ""
    setSearchQuery(query)
  }, [])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedFilters") || "[]")
    setSavedFilters(saved)
  }, [])

  const getCurrentFilterState = (): FilterState => {
    return {
      transactionType: (searchParams.get("transactionType") || "") as "sale" | "rent" | "",
      propertyType: searchParams.get("propertyType") || searchParams.get("type") || "",
      province: searchParams.get("province") || "",
      district: searchParams.get("district") || "",
      priceRange: [
        searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : 0,
        searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : 50,
      ],
      areaRange: [
        searchParams.get("areaMin") ? Number(searchParams.get("areaMin")) : 0,
        searchParams.get("areaMax") ? Number(searchParams.get("areaMax")) : 500,
      ],
      bedrooms: searchParams.get("bedrooms")?.split(",") || [],
      bathrooms: searchParams.get("bathrooms")?.split(",") || [],
      direction: searchParams.get("direction")?.split(",") || [],
      legal: searchParams.get("legal")?.split(",") || [],
    }
  }

  const handleApplyFilters = (newFilters: FilterState) => {
    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    }

    if (newFilters.transactionType) {
      params.set("transactionType", newFilters.transactionType)
    }

    if (newFilters.propertyType) {
      params.set("propertyType", newFilters.propertyType)
    }

    if (newFilters.province) {
      params.set("province", newFilters.province)
    }

    if (newFilters.district) {
      params.set("district", newFilters.district)
    }

    const defaultMaxPrice = newFilters.transactionType === "rent" ? 200 : 50
    if (newFilters.priceRange[0] > 0 || newFilters.priceRange[1] < defaultMaxPrice) {
      params.set("priceMin", newFilters.priceRange[0].toString())
      params.set("priceMax", newFilters.priceRange[1].toString())
    }

    if (newFilters.areaRange[0] > 0 || newFilters.areaRange[1] < 500) {
      params.set("areaMin", newFilters.areaRange[0].toString())
      params.set("areaMax", newFilters.areaRange[1].toString())
    }

    if (newFilters.bedrooms.length > 0) {
      params.set("bedrooms", newFilters.bedrooms.join(","))
    }

    if (newFilters.bathrooms.length > 0) {
      params.set("bathrooms", newFilters.bathrooms.join(","))
    }

    if (newFilters.direction.length > 0) {
      params.set("direction", newFilters.direction.join(","))
    }

    if (newFilters.legal.length > 0) {
      params.set("legal", newFilters.legal.join(","))
    }

    router.push(`/search?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    } else {
      params.delete("q")
      params.delete("search")
    }

    router.push(`/search?${params.toString()}`)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const getActiveFilters = () => {
    const activeFilters = []

    if (filters.transactionType) {
      activeFilters.push({
        key: "transactionType",
        label: filters.transactionType === "sale" ? "Mua bán" : "Cho thuê",
        value: filters.transactionType,
      })
    }

    if (filters.propertyType) {
      activeFilters.push({
        key: "propertyType",
        label: propertyTypeNames[filters.propertyType as keyof typeof propertyTypeNames] || filters.propertyType,
        value: filters.propertyType,
      })
    }

    if (filters.district) {
      activeFilters.push({
        key: "district",
        label: filters.district,
        value: filters.district,
      })
    }

    if (filters.minPrice || filters.maxPrice) {
      const unit = filters.transactionType === "rent" ? "tr/tháng" : "tỷ"
      activeFilters.push({
        key: "price",
        label: `${filters.minPrice || 0}-${filters.maxPrice || (filters.transactionType === "rent" ? 200 : 50)} ${unit}`,
        value: "price",
      })
    }

    return activeFilters
  }

  const activeFilters = getActiveFilters()

  const removeFilter = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString())

    switch (filterKey) {
      case "transactionType":
        params.delete("transactionType")
        break
      case "propertyType":
        params.delete("propertyType")
        params.delete("type")
        break
      case "district":
        params.delete("district")
        break
      case "price":
        params.delete("priceMin")
        params.delete("priceMax")
        break
    }

    router.push(`/search?${params.toString()}`)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    }
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Compact Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        {/* Top Row: Search Bar */}
        <div className="p-4 pb-3">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Nhập từ khóa tìm kiếm..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="pl-10 pr-16"
                autoComplete="off"
                autoFocus={false}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-3 text-xs"
              >
                Tìm
              </Button>
            </div>
          </form>
        </div>

        {/* Bottom Row: Filter & View Controls */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowFilterSheet(true)} variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Bộ lọc
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>

            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>{loading ? "Đang tìm..." : `${properties.length} kết quả`}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="gap-1.5"
          >
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            <span className="text-xs">{viewMode === "grid" ? "Danh sách" : "Lưới"}</span>
          </Button>
        </div>

        {activeFilters.length > 0 && (
          <div className="px-4 pb-3 border-t bg-gray-50">
            <div className="flex items-center gap-2 py-2">
              <span className="text-xs text-gray-600 shrink-0">Đang lọc:</span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter.key}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-700 text-xs h-6 px-2"
                    onClick={() => removeFilter(filter.key)}
                  >
                    {filter.label} ×
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-500 hover:text-red-700 h-6 px-2 text-xs shrink-0"
              >
                Xóa tất cả
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="p-4">
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        )}

        {loading && (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {viewMode === "grid" ? (
                  <>
                    <Skeleton className="w-full h-48 rounded-none" />
                    <div className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </>
                ) : (
                  <div className="flex">
                    <Skeleton className="w-32 h-24 rounded-none" />
                    <div className="flex-1 p-3">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <>
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <Button onClick={clearAllFilters} variant="outline">
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} layout={viewMode} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <FilterBottomSheet
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        onApply={handleApplyFilters}
        initialFilters={getCurrentFilterState()}
        savedFilters={savedFilters}
        onLoadSavedFilter={(filter) => {
          const updated = JSON.parse(localStorage.getItem("savedFilters") || "[]")
          setSavedFilters(updated)
        }}
      />

      <MobileNavigation />
    </div>
  )
}
