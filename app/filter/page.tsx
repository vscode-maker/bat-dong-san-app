"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Search, MapPin, Bookmark, RotateCcw, Sparkles, Filter, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MobileNavigation from "@/components/mobile-navigation"
import { useToast } from "@/contexts/toast-context"

// Mock data for locations
const provinces = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Bình Dương",
  "Đồng Nai",
  "Khánh Hòa",
  "Bà Rịa - Vũng Tàu",
  "Cần Thơ",
]

const districts = {
  "TP. Hồ Chí Minh": [
    "Quận 1",
    "Quận 2",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 9",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Quận Bình Thạnh",
    "Quận Tân Bình",
    "Quận Tân Phú",
    "Quận Phú Nhuận",
    "Quận Gò Vấp",
  ],
  "Hà Nội": [
    "Quận Ba Đình",
    "Quận Hoàn Kiếm",
    "Quận Tây Hồ",
    "Quận Long Biên",
    "Quận Cầu Giấy",
    "Quận Đống Đa",
    "Quận Hai Bà Trưng",
    "Quận Hoàng Mai",
  ],
  "Bình Dương": ["Thủ Dầu Một", "Dĩ An", "Thuận An", "Tân Uyên", "Bến Cát"],
}

// Property types
const propertyTypes = [
  { id: "apartment", name: "Căn hộ/Chung cư", icon: "🏢" },
  { id: "house", name: "Nhà riêng", icon: "🏠" },
  { id: "villa", name: "Biệt thự", icon: "🏡" },
  { id: "land", name: "Đất nền", icon: "🌱" },
  { id: "shophouse", name: "Shophouse", icon: "🏪" },
  { id: "office", name: "Văn phòng", icon: "🏢" },
  { id: "warehouse", name: "Kho/Xưởng", icon: "🏭" },
]

// Legal status options
const legalOptions = ["Sổ hồng/Sổ đỏ", "Hợp đồng mua bán", "Giấy tờ hợp lệ khác"]

// Direction options
const directionOptions = ["Đông", "Tây", "Nam", "Bắc", "Đông Nam", "Đông Bắc", "Tây Nam", "Tây Bắc"]

interface FilterState {
  searchQuery: string
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
  features: string[]
}

const defaultFilter: FilterState = {
  searchQuery: "",
  transactionType: "",
  propertyType: "",
  province: "",
  district: "",
  priceRange: [0, 50],
  areaRange: [0, 500],
  bedrooms: [],
  bathrooms: [],
  direction: [],
  legal: [],
  features: [],
}

// Saved filters for user
const savedFilters = [
  {
    id: 1,
    name: "Căn hộ Q7 dưới 5 tỷ",
    filter: {
      transactionType: "sale",
      propertyType: "apartment",
      province: "TP. Hồ Chí Minh",
      district: "Quận 7",
      priceRange: [0, 5],
      areaRange: [50, 100],
    },
    createdAt: "2024-01-15",
    resultCount: 24,
  },
  {
    id: 2,
    name: "Nhà thuê Thảo Điền",
    filter: {
      transactionType: "rent",
      propertyType: "house",
      province: "TP. Hồ Chí Minh",
      district: "Quận 2",
      priceRange: [20, 50],
      bedrooms: ["3", "4"],
    },
    createdAt: "2024-01-10",
    resultCount: 12,
  },
]

export default function FilterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [filter, setFilter] = useState<FilterState>(defaultFilter)
  const [userSavedFilters, setUserSavedFilters] = useState(savedFilters)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [filterName, setFilterName] = useState("")
  const { warning } = useToast()

  // Initialize filter from URL params
  useEffect(() => {
    const type = searchParams.get("type")
    const transactionType = searchParams.get("transactionType")

    if (type) {
      setFilter((prev) => ({ ...prev, propertyType: type }))
    }
    if (transactionType) {
      setFilter((prev) => ({ ...prev, transactionType: transactionType as "sale" | "rent" }))
    }
  }, [searchParams])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilter = () => {
    setFilter(defaultFilter)
  }

  const saveFilter = () => {
    if (!filterName.trim()) return

    const newFilter = {
      id: Date.now(),
      name: filterName,
      filter: { ...filter },
      createdAt: new Date().toISOString().split("T")[0],
      resultCount: Math.floor(Math.random() * 50) + 1,
    }

    setUserSavedFilters((prev) => [newFilter, ...prev])
    setFilterName("")
    setShowSaveDialog(false)

    // Save to localStorage
    localStorage.setItem("savedFilters", JSON.stringify([newFilter, ...userSavedFilters]))
  }

  const loadSavedFilter = (savedFilter: any) => {
    const newFilter = { ...defaultFilter, ...savedFilter.filter }
    setFilter(newFilter)
  }

  const deleteSavedFilter = (id: number) => {
    const updated = userSavedFilters.filter((f) => f.id !== id)
    setUserSavedFilters(updated)
    localStorage.setItem("savedFilters", JSON.stringify(updated))
  }

  const applyFilter = () => {
    // Build query string and navigate to results
    const params = new URLSearchParams()

    if (filter.searchQuery.trim()) {
      params.set("q", filter.searchQuery.trim())
    }

    if (filter.transactionType) {
      params.set("type", filter.transactionType)
    }

    if (filter.propertyType) {
      params.set("propertyType", filter.propertyType)
    }

    if (filter.province) {
      params.set("province", filter.province)
    }

    if (filter.district) {
      params.set("district", filter.district)
    }

    const defaultMaxPrice = filter.transactionType === "rent" ? 200 : 50
    if (filter.priceRange[0] > 0 || filter.priceRange[1] < defaultMaxPrice) {
      params.set("priceMin", filter.priceRange[0].toString())
      params.set("priceMax", filter.priceRange[1].toString())
    }

    if (filter.areaRange[0] > 0 || filter.areaRange[1] < 500) {
      params.set("areaMin", filter.areaRange[0].toString())
      params.set("areaMax", filter.areaRange[1].toString())
    }

    if (filter.bedrooms.length > 0) {
      params.set("bedrooms", filter.bedrooms.join(","))
    }

    if (filter.bathrooms.length > 0) {
      params.set("bathrooms", filter.bathrooms.join(","))
    }

    if (filter.direction.length > 0) {
      params.set("direction", filter.direction.join(","))
    }

    if (filter.legal.length > 0) {
      params.set("legal", filter.legal.join(","))
    }

    router.push(`/results?${params.toString()}`)
  }

  const loadAndApplySavedFilter = (savedFilter: any) => {
    loadSavedFilter(savedFilter)
    setTimeout(() => {
      applyFilter()
    }, 100)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filter.transactionType) count++
    if (filter.propertyType) count++
    if (filter.province) count++
    if (filter.district) count++
    if (filter.priceRange[0] > 0 || filter.priceRange[1] < 50) count++
    if (filter.areaRange[0] > 0 || filter.areaRange[1] < 500) count++
    if (filter.bedrooms.length > 0) count++
    if (filter.bathrooms.length > 0) count++
    if (filter.direction.length > 0) count++
    if (filter.legal.length > 0) count++
    return count
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pb-20">
      {/* Modern Header with Glass Effect */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="px-4 py-3">
          {/* Header Row */}
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/60 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            <div className="flex-1">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Bộ lọc tìm kiếm
              </h1>
              {getActiveFiltersCount() > 0 && (
                <p className="text-sm text-slate-500 mt-0.5">{getActiveFiltersCount()} bộ lọc đang áp dụng</p>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilter}
              className="rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-800 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Modern Search Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <Input
              placeholder="Tìm kiếm theo từ khóa, địa điểm..."
              value={filter.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              className="pl-12 h-12 bg-white/60 border-white/40 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:bg-white/80 focus:border-blue-200 transition-all duration-200 shadow-sm"
            />
            {filter.searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateFilter("searchQuery", "")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full hover:bg-slate-100"
              >
                ×
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <Tabs defaultValue="filter" className="w-full">
          {/* Modern Tab List */}
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 shadow-sm border border-white/40">
            <TabsTrigger
              value="filter"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 font-medium transition-all duration-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 font-medium transition-all duration-200"
            >
              <Heart className="w-4 h-4 mr-2" />
              Đã lưu ({userSavedFilters.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="filter" className="space-y-6">
            {/* Transaction Type - Modern Toggle */}
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Loại giao dịch
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={filter.transactionType === "sale" ? "default" : "outline"}
                    onClick={() => updateFilter("transactionType", "sale")}
                    className={`h-12 rounded-xl font-medium transition-all duration-300 ${
                      filter.transactionType === "sale"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transform hover:scale-[1.02]"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    💰 Mua bán
                  </Button>
                  <Button
                    variant={filter.transactionType === "rent" ? "default" : "outline"}
                    onClick={() => updateFilter("transactionType", "rent")}
                    className={`h-12 rounded-xl font-medium transition-all duration-300 ${
                      filter.transactionType === "rent"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-[1.02]"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    🏠 Cho thuê
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Type - Modern Grid */}
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Loại hình bất động sản
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2">
                  {propertyTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={filter.propertyType === type.id ? "default" : "outline"}
                      onClick={() => updateFilter("propertyType", type.id)}
                      className={`h-12 rounded-xl font-medium transition-all duration-300 text-left justify-start ${
                        filter.propertyType === type.id
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="mr-2 text-lg">{type.icon}</span>
                      <span className="text-sm">{type.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location - Modern Selects */}
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Vị trí
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-slate-600">Tỉnh/Thành phố</label>
                  <Select
                    value={filter.province}
                    onValueChange={(value) => {
                      updateFilter("province", value)
                      updateFilter("district", "")
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <SelectValue placeholder="Chọn tỉnh/thành phố" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province} className="rounded-lg">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {province}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {filter.province && districts[filter.province as keyof typeof districts] && (
                  <div>
                    <label className="text-sm font-medium mb-2 block text-slate-600">Quận/Huyện</label>
                    <Select value={filter.district} onValueChange={(value) => updateFilter("district", value)}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                        {districts[filter.province as keyof typeof districts].map((district) => (
                          <SelectItem key={district} value={district} className="rounded-lg">
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Range - Modern Slider */}
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Khoảng giá {filter.transactionType === "rent" ? "(triệu/tháng)" : "(tỷ)"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="px-2">
                  <Slider
                    value={filter.priceRange}
                    onValueChange={(value) => updateFilter("priceRange", value)}
                    max={filter.transactionType === "rent" ? 200 : 50}
                    step={filter.transactionType === "rent" ? 5 : 0.5}
                    className="mb-4"
                  />
                  <div className="flex justify-between">
                    <div className="px-3 py-2 bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl border border-orange-200">
                      <span className="text-sm font-semibold text-orange-700">
                        {filter.priceRange[0]} {filter.transactionType === "rent" ? "tr" : "tỷ"}
                      </span>
                    </div>
                    <div className="px-3 py-2 bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl border border-orange-200">
                      <span className="text-sm font-semibold text-orange-700">
                        {filter.priceRange[1]} {filter.transactionType === "rent" ? "tr" : "tỷ"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Area Range */}
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  Diện tích (m²)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="px-2">
                  <Slider
                    value={filter.areaRange}
                    onValueChange={(value) => updateFilter("areaRange", value)}
                    max={500}
                    step={10}
                    className="mb-4"
                  />
                  <div className="flex justify-between">
                    <div className="px-3 py-2 bg-gradient-to-r from-teal-100 to-teal-50 rounded-xl border border-teal-200">
                      <span className="text-sm font-semibold text-teal-700">{filter.areaRange[0]}m²</span>
                    </div>
                    <div className="px-3 py-2 bg-gradient-to-r from-teal-100 to-teal-50 rounded-xl border border-teal-200">
                      <span className="text-sm font-semibold text-teal-700">{filter.areaRange[1]}m²</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bedrooms & Bathrooms - Compact Grid */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    Số phòng ngủ
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {["1", "2", "3", "4", "5+"].map((bedroom) => (
                      <Badge
                        key={bedroom}
                        variant={filter.bedrooms.includes(bedroom) ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          filter.bedrooms.includes(bedroom)
                            ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg transform hover:scale-105"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                        }`}
                        onClick={() => {
                          const updated = filter.bedrooms.includes(bedroom)
                            ? filter.bedrooms.filter((b) => b !== bedroom)
                            : [...filter.bedrooms, bedroom]
                          updateFilter("bedrooms", updated)
                        }}
                      >
                        🛏️ {bedroom} PN
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    Số phòng tắm
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {["1", "2", "3", "4+"].map((bathroom) => (
                      <Badge
                        key={bathroom}
                        variant={filter.bathrooms.includes(bathroom) ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          filter.bathrooms.includes(bathroom)
                            ? "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg transform hover:scale-105"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                        }`}
                        onClick={() => {
                          const updated = filter.bathrooms.includes(bathroom)
                            ? filter.bathrooms.filter((b) => b !== bathroom)
                            : [...filter.bathrooms, bathroom]
                          updateFilter("bathrooms", updated)
                        }}
                      >
                        🚿 {bathroom} WC
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Direction - Compass Style */}
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Hướng nhà
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-4 gap-2">
                  {directionOptions.map((direction) => (
                    <Badge
                      key={direction}
                      variant={filter.direction.includes(direction) ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-2 text-center rounded-xl font-medium transition-all duration-300 ${
                        filter.direction.includes(direction)
                          ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                      }`}
                      onClick={() => {
                        const updated = filter.direction.includes(direction)
                          ? filter.direction.filter((d) => d !== direction)
                          : [...filter.direction, direction]
                        updateFilter("direction", updated)
                      }}
                    >
                      🧭 {direction}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Legal Status - Modern Checkboxes */}
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Pháp lý
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {legalOptions.map((legal) => (
                    <div
                      key={legal}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => {
                        const updated = filter.legal.includes(legal)
                          ? filter.legal.filter((l) => l !== legal)
                          : [...filter.legal, legal]
                        updateFilter("legal", updated)
                      }}
                    >
                      <Checkbox
                        id={legal}
                        checked={filter.legal.includes(legal)}
                        onCheckedChange={(checked) => {
                          const updated = checked ? [...filter.legal, legal] : filter.legal.filter((l) => l !== legal)
                          updateFilter("legal", updated)
                        }}
                        className="rounded-md border-2 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                      />
                      <label htmlFor={legal} className="text-sm font-medium text-slate-700 cursor-pointer flex-1">
                        📋 {legal}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons - Modern Design */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowSaveDialog(true)}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-all duration-200"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Lưu bộ lọc
              </Button>
              <Button
                onClick={applyFilter}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Áp dụng bộ lọc
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            {userSavedFilters.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Chưa có bộ lọc nào được lưu</h3>
                <p className="text-slate-500">Tạo và lưu bộ lọc để tìm kiếm nhanh hơn</p>
              </div>
            ) : (
              userSavedFilters.map((savedFilter) => (
                <Card
                  key={savedFilter.id}
                  className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-slate-900 text-lg">{savedFilter.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSavedFilter(savedFilter.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                      >
                        ×
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                      <span>📅 {new Date(savedFilter.createdAt).toLocaleDateString("vi-VN")}</span>
                      <span>📊 {savedFilter.resultCount} kết quả</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {savedFilter.filter.transactionType && (
                        <Badge variant="outline" className="rounded-lg border-slate-200 bg-slate-50">
                          {savedFilter.filter.transactionType === "sale" ? "💰 Mua bán" : "🏠 Cho thuê"}
                        </Badge>
                      )}
                      {savedFilter.filter.propertyType && (
                        <Badge variant="outline" className="rounded-lg border-slate-200 bg-slate-50">
                          {propertyTypes.find((t) => t.id === savedFilter.filter.propertyType)?.icon}{" "}
                          {propertyTypes.find((t) => t.id === savedFilter.filter.propertyType)?.name}
                        </Badge>
                      )}
                      {savedFilter.filter.district && (
                        <Badge variant="outline" className="rounded-lg border-slate-200 bg-slate-50">
                          <MapPin className="w-3 h-3 mr-1" />
                          {savedFilter.filter.district}
                        </Badge>
                      )}
                    </div>

                    <Button
                      onClick={() => loadAndApplySavedFilter(savedFilter)}
                      className="w-full h-11 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Sử dụng bộ lọc này
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Save Filter Dialog - Modern Modal */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border-0 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800">Lưu bộ lọc</CardTitle>
              <p className="text-sm text-slate-500">Đặt tên để dễ dàng sử dụng lại sau</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium mb-2 block text-slate-700">Tên bộ lọc</label>
                <Input
                  placeholder="VD: Căn hộ Q7 dưới 5 tỷ..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 h-11 rounded-xl border-slate-200 hover:bg-slate-50"
                >
                  Hủy
                </Button>
                <Button
                  onClick={saveFilter}
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg transition-all duration-200"
                  disabled={!filterName.trim()}
                >
                  Lưu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <MobileNavigation />
    </div>
  )
}
