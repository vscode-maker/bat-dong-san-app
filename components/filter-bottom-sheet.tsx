"use client"

import { useState, useEffect } from "react"
import { X, RotateCcw, Bookmark, MapPin, BookmarkCheck, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
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
  { id: "apartment", name: "Căn hộ/Chung cư" },
  { id: "house", name: "Nhà riêng" },
  { id: "villa", name: "Biệt thự" },
  { id: "land", name: "Đất nền" },
  { id: "shophouse", name: "Shophouse" },
  { id: "office", name: "Văn phòng" },
  { id: "warehouse", name: "Kho/Xưởng" },
]

// Legal status options
const legalOptions = ["Sổ hồng/Sổ đỏ", "Hợp đồng mua bán", "Giấy tờ hợp lệ khác"]

// Direction options
const directionOptions = ["Đông", "Tây", "Nam", "Bắc", "Đông Nam", "Đông Bắc", "Tây Nam", "Tây Bắc"]

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

const defaultFilter: FilterState = {
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
}

interface FilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterState) => void
  initialFilters?: Partial<FilterState>
  savedFilters?: any[]
  onLoadSavedFilter?: (filter: any) => void
  onSaveFilter?: () => void
}

export default function FilterBottomSheet({
  isOpen,
  onClose,
  onApply,
  initialFilters = {},
  savedFilters = [],
  onLoadSavedFilter,
  onSaveFilter,
}: FilterBottomSheetProps) {
  const [filter, setFilter] = useState<FilterState>({ ...defaultFilter, ...initialFilters })
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [filterName, setFilterName] = useState("")
  const [localSavedFilters, setLocalSavedFilters] = useState(savedFilters)

  const { success, warning } = useToast()

  useEffect(() => {
    setFilter({ ...defaultFilter, ...initialFilters })
  }, [initialFilters])

  useEffect(() => {
    setLocalSavedFilters(savedFilters)
  }, [savedFilters])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilter = () => {
    setFilter(defaultFilter)
  }

  const generateFilterName = () => {
    const parts = []

    if (filter.transactionType) {
      parts.push(filter.transactionType === "sale" ? "Mua bán" : "Cho thuê")
    }

    if (filter.propertyType) {
      const propertyTypeName = propertyTypes.find((t) => t.id === filter.propertyType)?.name
      parts.push(propertyTypeName)
    }

    if (filter.district) {
      parts.push(filter.district)
    } else if (filter.province) {
      parts.push(filter.province)
    }

    if (filter.priceRange[0] > 0 || filter.priceRange[1] < (filter.transactionType === "rent" ? 200 : 50)) {
      const unit = filter.transactionType === "rent" ? "tr" : "tỷ"
      parts.push(`${filter.priceRange[0]}-${filter.priceRange[1]}${unit}`)
    }

    return parts.length > 0 ? parts.join(" ") : "Bộ lọc mới"
  }

  const saveCurrentFilter = () => {
    const name = filterName.trim() || generateFilterName()

    const newFilter = {
      id: Date.now(),
      name: name,
      filters: { ...filter },
      createdAt: new Date().toISOString(),
      resultCount: 0, // Will be updated when applied
    }

    const existingSaved = JSON.parse(localStorage.getItem("savedFilters") || "[]")
    const updated = [newFilter, ...existingSaved]

    localStorage.setItem("savedFilters", JSON.stringify(updated))
    setLocalSavedFilters(updated)

    setFilterName("")
    setShowSaveDialog(false)

    return newFilter
  }

  const handleSaveAndApply = () => {
    // Save the filter first
    const savedFilter = saveCurrentFilter()

    // Apply the current filter state
    onApply(filter)

    // Close the popup
    onClose()

    // Show success message
    setTimeout(() => {
      success("Đã lưu và áp dụng!", `Bộ lọc "${savedFilter.name}" đã được lưu và áp dụng tìm kiếm`)
    }, 100)
  }

  const handleApplyOnly = () => {
    // Just apply the filter without saving
    onApply(filter)
    onClose()
  }

  const handleSaveOnly = () => {
    setShowSaveDialog(true)
  }

  const confirmSaveFilter = () => {
    const savedFilter = saveCurrentFilter()
    success("Đã lưu bộ lọc!", `Bộ lọc "${savedFilter.name}" đã được lưu thành công`)
  }

  const deleteSavedFilter = (filterId: number) => {
    const updated = localSavedFilters.filter((f) => f.id !== filterId)
    setLocalSavedFilters(updated)
    localStorage.setItem("savedFilters", JSON.stringify(updated))
  }

  const loadSavedFilter = (savedFilter: any) => {
    const newFilter = { ...defaultFilter, ...savedFilter.filters }
    setFilter(newFilter)

    if (onLoadSavedFilter) {
      onLoadSavedFilter(savedFilter)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-3xl z-50 max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300 border-t border-gray-200/50">
        {/* iOS 18 Style Header */}
        <div className="relative px-4 py-2 border-b border-gray-200/50">
          {/* Drag Handle */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-300 rounded-full"></div>

          {/* Header Content */}
          <div className="flex items-center justify-between">
            {/* Left: Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200"
            >
              <X className="w-4 h-4 text-gray-600" />
            </Button>

            {/* Center: Title */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">Bộ lọc tìm kiếm</h2>
            </div>

            {/* Right: Reset Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilter}
              className="h-8 px-2 rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 text-gray-600 hover:text-gray-800"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span className="text-sm font-medium">Reset</span>
            </Button>
          </div>

          {/* Action Buttons - Simplified */}
          <div className="mt-2 flex gap-2">
            <Button
              onClick={handleSaveAndApply}
              variant="outline"
              className="flex-1 h-10 bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-300 text-sm"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Lưu bộ lọc và tìm kiếm
            </Button>
            <Button
              onClick={handleApplyOnly}
              className="flex-1 h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-170px)]">
          <Tabs defaultValue="filter" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-3 mb-3 bg-gray-100/50 rounded-xl p-1">
              <TabsTrigger
                value="filter"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 text-sm font-medium"
              >
                Bộ lọc
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 text-sm font-medium"
              >
                Đã lưu ({localSavedFilters.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="filter" className="px-3 space-y-4">
              {/* Transaction Type */}
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-900">Loại giao dịch</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={filter.transactionType === "sale" ? "default" : "outline"}
                      onClick={() => updateFilter("transactionType", "sale")}
                      className={`h-10 rounded-xl font-medium transition-all duration-200 text-sm ${
                        filter.transactionType === "sale"
                          ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Mua bán
                    </Button>
                    <Button
                      variant={filter.transactionType === "rent" ? "default" : "outline"}
                      onClick={() => updateFilter("transactionType", "rent")}
                      className={`h-10 rounded-xl font-medium transition-all duration-200 text-sm ${
                        filter.transactionType === "rent"
                          ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Cho thuê
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Property Type */}
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-900">Loại hình bất động sản</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <Select value={filter.propertyType} onValueChange={(value) => updateFilter("propertyType", value)}>
                    <SelectTrigger className="h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm">
                      <SelectValue placeholder="Chọn loại hình" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-xl">
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id} className="rounded-lg text-sm">
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-900">Vị trí</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3 pb-2">
                  <div>
                    <label className="text-xs font-medium mb-1 block text-gray-700">Tỉnh/Thành phố</label>
                    <Select
                      value={filter.province}
                      onValueChange={(value) => {
                        updateFilter("province", value)
                        updateFilter("district", "")
                      }}
                    >
                      <SelectTrigger className="h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm">
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-0 shadow-xl">
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province} className="rounded-lg text-sm">
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {filter.province && districts[filter.province as keyof typeof districts] && (
                    <div>
                      <label className="text-xs font-medium mb-1 block text-gray-700">Quận/Huyện</label>
                      <Select value={filter.district} onValueChange={(value) => updateFilter("district", value)}>
                        <SelectTrigger className="h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm">
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-xl">
                          {districts[filter.province as keyof typeof districts].map((district) => (
                            <SelectItem key={district} value={district} className="rounded-lg text-sm">
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Price Range */}
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-900">
                    Khoảng giá {filter.transactionType === "rent" ? "(triệu/tháng)" : "(tỷ)"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <div className="px-1">
                    <Slider
                      value={filter.priceRange}
                      onValueChange={(value) => updateFilter("priceRange", value)}
                      max={filter.transactionType === "rent" ? 200 : 50}
                      step={filter.transactionType === "rent" ? 5 : 0.5}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-xs text-gray-600 font-medium">
                      <span className="px-2 py-1 bg-gray-100 rounded-lg">
                        {filter.priceRange[0]} {filter.transactionType === "rent" ? "tr" : "tỷ"}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-lg">
                        {filter.priceRange[1]} {filter.transactionType === "rent" ? "tr" : "tỷ"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Area Range */}
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-900">Diện tích (m²)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <div className="px-1">
                    <Slider
                      value={filter.areaRange}
                      onValueChange={(value) => updateFilter("areaRange", value)}
                      max={500}
                      step={10}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-xs text-gray-600 font-medium">
                      <span className="px-2 py-1 bg-gray-100 rounded-lg">{filter.areaRange[0]}m²</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-lg">{filter.areaRange[1]}m²</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bedrooms */}
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-900">Số phòng ngủ</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <div className="flex flex-wrap gap-1">
                    {["1", "2", "3", "4", "5+"].map((bedroom) => (
                      <Badge
                        key={bedroom}
                        variant={filter.bedrooms.includes(bedroom) ? "default" : "outline"}
                        className={`cursor-pointer px-3 py-1 rounded-xl font-medium transition-all duration-200 text-xs ${
                          filter.bedrooms.includes(bedroom)
                            ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          const updated = filter.bedrooms.includes(bedroom)
                            ? filter.bedrooms.filter((b) => b !== bedroom)
                            : [...filter.bedrooms, bedroom]
                          updateFilter("bedrooms", updated)
                        }}
                      >
                        {bedroom} PN
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bathrooms */}
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-900">Số phòng tắm</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <div className="flex flex-wrap gap-1">
                    {["1", "2", "3", "4+"].map((bathroom) => (
                      <Badge
                        key={bathroom}
                        variant={filter.bathrooms.includes(bathroom) ? "default" : "outline"}
                        className={`cursor-pointer px-3 py-1 rounded-xl font-medium transition-all duration-200 text-xs ${
                          filter.bathrooms.includes(bathroom)
                            ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          const updated = filter.bathrooms.includes(bathroom)
                            ? filter.bathrooms.filter((b) => b !== bathroom)
                            : [...filter.bathrooms, bathroom]
                          updateFilter("bathrooms", updated)
                        }}
                      >
                        {bathroom} WC
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Direction */}
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-900">Hướng nhà</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <div className="grid grid-cols-4 gap-1">
                    {directionOptions.map((direction) => (
                      <Badge
                        key={direction}
                        variant={filter.direction.includes(direction) ? "default" : "outline"}
                        className={`cursor-pointer px-2 py-1 text-center rounded-xl font-medium transition-all duration-200 text-xs ${
                          filter.direction.includes(direction)
                            ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          const updated = filter.direction.includes(direction)
                            ? filter.direction.filter((d) => d !== direction)
                            : [...filter.direction, direction]
                          updateFilter("direction", updated)
                        }}
                      >
                        {direction}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Legal Status */}
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl mb-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-900">Pháp lý</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <div className="space-y-2">
                    {legalOptions.map((legal) => (
                      <div
                        key={legal}
                        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          id={legal}
                          checked={filter.legal.includes(legal)}
                          onCheckedChange={(checked) => {
                            const updated = checked ? [...filter.legal, legal] : filter.legal.filter((l) => l !== legal)
                            updateFilter("legal", updated)
                          }}
                          className="rounded-md"
                        />
                        <label htmlFor={legal} className="text-xs font-medium text-gray-700 cursor-pointer">
                          {legal}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="px-3">
              {localSavedFilters.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bookmark className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-md font-semibold text-gray-600 mb-1">Chưa có bộ lọc nào được lưu</h3>
                  <p className="text-gray-500 text-sm">Tạo và lưu bộ lọc để tìm kiếm nhanh hơn</p>
                </div>
              ) : (
                <div className="space-y-2 pb-3">
                  {localSavedFilters.map((savedFilter) => (
                    <Card
                      key={savedFilter.id}
                      className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">{savedFilter.name}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSavedFilter(savedFilter.id)
                            }}
                            className="h-5 w-5 p-0 rounded-full hover:bg-red-50 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-xs text-gray-600 mb-2">
                          <div>Tạo ngày: {new Date(savedFilter.createdAt).toLocaleDateString("vi-VN")}</div>
                          {savedFilter.resultCount > 0 && <div>{savedFilter.resultCount} kết quả</div>}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {savedFilter.filters.transactionType && (
                            <Badge variant="outline" className="rounded-lg border-gray-200 text-xs">
                              {savedFilter.filters.transactionType === "sale" ? "Mua bán" : "Cho thuê"}
                            </Badge>
                          )}
                          {savedFilter.filters.propertyType && (
                            <Badge variant="outline" className="rounded-lg border-gray-200 text-xs">
                              {propertyTypes.find((t) => t.id === savedFilter.filters.propertyType)?.name}
                            </Badge>
                          )}
                          {savedFilter.filters.district && (
                            <Badge variant="outline" className="rounded-lg border-gray-200 text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              {savedFilter.filters.district}
                            </Badge>
                          )}
                        </div>

                        <Button
                          onClick={() => {
                            loadSavedFilter(savedFilter)
                            // Apply the saved filter
                            onApply({ ...defaultFilter, ...savedFilter.filters })
                            onClose()
                          }}
                          className="w-full h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 text-sm"
                        >
                          <BookmarkCheck className="w-4 h-4 mr-2" />
                          Sử ddụng
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md bg-white rounded-2xl">
            <CardHeader>
              <CardTitle>Lưu bộ lọc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Tên bộ lọc</label>
                <Input
                  placeholder={generateFilterName()}
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && confirmSaveFilter()}
                  className="rounded-xl h-10 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Để trống để sử dụng tên tự động</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSaveDialog(false)
                    setFilterName("")
                  }}
                  className="flex-1 rounded-xl text-sm"
                >
                  Hủy
                </Button>
                <Button onClick={confirmSaveFilter} className="flex-1 rounded-xl text-sm">
                  Lưu bộ lọc
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
