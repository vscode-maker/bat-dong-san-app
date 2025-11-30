"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Plus, ArrowLeft, Search, Heart, MapPin, Ruler, Bed, Bath, Car, Shield, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/contexts/toast-context"
import MobileNavigation from "@/components/mobile-navigation"

// Mock data cho properties có thể so sánh
const availableProperties = [
  {
    id: 1,
    title: "Bán nhà 3 tầng, hẻm xe tải, đường Trần Thái Tông",
    price: "9.5 tỷ",
    location: "Trần Thái Tông, Quận Tân Bình, TP.HCM",
    image: "/placeholder.svg?height=200&width=300&text=Nhà+3+tầng",
    area: 120,
    bedrooms: 4,
    bathrooms: 3,
    floor: 3,
    direction: "Đông Nam",
    legal: "Sổ hồng riêng",
    pricePerM2: 79166667,
    type: "sale",
    propertyType: "house",
    yearBuilt: 2020,
    parking: 2,
  },
  {
    id: 2,
    title: "OPAL SKYLINE - Bình Dương - 73m2 - 2PN - căn góc",
    price: "1.98 tỷ",
    location: "Bình Dương",
    image: "/placeholder.svg?height=200&width=300&text=Căn+hộ+Opal",
    area: 73,
    bedrooms: 2,
    bathrooms: 2,
    floor: 15,
    direction: "Đông",
    legal: "Sổ hồng riêng",
    pricePerM2: 27123288,
    type: "sale",
    propertyType: "apartment",
    yearBuilt: 2022,
    parking: 1,
  },
  {
    id: 5,
    title: "Biệt thự mini 2 tầng, sân vườn rộng",
    price: "15 tỷ",
    location: "Quận 9, TP.HCM",
    image: "/placeholder.svg?height=200&width=300&text=Biệt+thự",
    area: 200,
    bedrooms: 5,
    bathrooms: 4,
    floor: 2,
    direction: "Nam",
    legal: "Sổ hồng riêng",
    pricePerM2: 75000000,
    type: "sale",
    propertyType: "villa",
    yearBuilt: 2021,
    parking: 3,
  },
  {
    id: 6,
    title: "Căn hộ Vinhomes Central Park, view sông Sài Gòn",
    price: "6.2 tỷ",
    location: "Vinhomes Central Park, Quận Bình Thạnh",
    image: "/placeholder.svg?height=200&width=300&text=Vinhomes+Central",
    area: 85,
    bedrooms: 2,
    bathrooms: 2,
    floor: 25,
    direction: "Đông Nam",
    legal: "Sổ hồng riêng",
    pricePerM2: 72941176,
    type: "sale",
    propertyType: "apartment",
    yearBuilt: 2019,
    parking: 1,
  },
]

const propertyTypeNames: any = {
  apartment: "Căn hộ",
  house: "Nhà phố",
  villa: "Biệt thự",
  land: "Đất nền",
}

// Helper function to convert price string/number to a comparable numeric value
const getNumericPrice = (priceInput: string | number | null | undefined): number => {
  if (priceInput === null || priceInput === undefined) return 0

  // Always work with a string
  const priceStr = String(priceInput)

  // Strip all characters except digits, dots and commas
  // Then normalise commas to dots before parsing
  const cleaned = priceStr.replace(/[^\d.,]/g, "").replace(",", ".")
  let value = Number.parseFloat(cleaned)
  if (Number.isNaN(value)) value = 0

  // Keyword multipliers
  if (priceStr.includes("tỷ")) {
    value *= 1_000_000_000
  } else if (priceStr.includes("triệu")) {
    value *= 1_000_000
  }
  return value
}

// Helper function to get the numeric value for a given key
const getNumericValue = (property: any, key: string) => {
  if (key === "price") {
    return getNumericPrice(property.price)
  }
  return property[key]
}

// Helper function to determine if a value should be highlighted and what class to apply
const getHighlightClass = (property: any, key: string, compareList: any[]) => {
  if (compareList.length <= 1) return "" // No comparison needed for 1 or less properties

  const values = compareList.map((p) => getNumericValue(p, key)).filter((v) => typeof v === "number")

  if (values.length === 0 || new Set(values).size === 1) {
    return "" // All values are the same or no numeric values
  }

  const currentVal = getNumericValue(property, key)

  if (key === "price" || key === "pricePerM2") {
    const minVal = Math.min(...values)
    return currentVal === minVal ? "text-green-700 bg-green-50 font-bold rounded-md px-2 py-1" : "" // Highlight lowest price
  } else if (["area", "bedrooms", "bathrooms", "floor", "parking", "yearBuilt"].includes(key)) {
    const maxVal = Math.max(...values)
    return currentVal === maxVal ? "text-blue-700 bg-blue-50 font-bold rounded-md px-2 py-1" : "" // Highlight highest value
  }
  return ""
}

export default function ComparePage() {
  const [compareList, setCompareList] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<number[]>([])
  const { success, warning, error } = useToast()

  // Load compare list from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("compareList")
    if (saved) {
      try {
        const parsedList = JSON.parse(saved)
        setCompareList(parsedList)
      } catch (error) {
        console.error("Error parsing compare list:", error)
      }
    }
  }, [])

  // Save compare list to localStorage
  useEffect(() => {
    localStorage.setItem("compareList", JSON.stringify(compareList))
  }, [compareList])

  const addToCompare = (property: any) => {
    if (compareList.length >= 4) {
      warning("Giới hạn so sánh", "Chỉ có thể so sánh tối đa 4 bất động sản cùng lúc")
      return
    }

    if (compareList.find((item) => item.id === property.id)) {
      warning("Đã tồn tại", "Bất động sản này đã có trong danh sách so sánh")
      return
    }

    setCompareList((prev) => [...prev, property])
    setShowAddModal(false)
    success("Thêm thành công", `Đã thêm "${property.title}" vào danh sách so sánh`)
  }

  const removeFromCompare = (propertyId: number) => {
    setCompareList((prev) => prev.filter((item) => item.id !== propertyId))
    success("Đã xóa", "Bất động sản đã được xóa khỏi danh sách so sánh")
  }

  const clearAll = () => {
    setCompareList([])
    success("Đã xóa tất cả", "Danh sách so sánh đã được làm trống")
  }

  const toggleFavorite = (propertyId: number) => {
    setFavorites((prev) => (prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]))
  }

  const filteredProperties = availableProperties.filter(
    (property) =>
      !compareList.find((item) => item.id === property.id) &&
      (searchQuery === "" ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 p-4 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">So sánh bất động sản</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Bắt đầu so sánh</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Thêm ít nhất 2 bất động sản để so sánh chi tiết về giá cả, diện tích, vị trí và các tiện ích khác
            </p>
            <Button onClick={() => setShowAddModal(true)} size="lg" className="rounded-xl px-8">
              <Plus className="w-5 h-5 mr-2" />
              Thêm bất động sản
            </Button>
          </div>
        </div>

        {/* Add Property Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Chọn bất động sản để so sánh</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm bất động sản..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-96">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProperties.map((property) => (
                    <Card
                      key={property.id}
                      className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-200"
                      onClick={() => addToCompare(property)}
                    >
                      <div className="relative">
                        <Image
                          src={property.image || "/placeholder.svg"}
                          alt={property.title}
                          width={300}
                          height={150}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full w-8 h-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(property.id)
                          }}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favorites.includes(property.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                            }`}
                          />
                        </Button>
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          {property.price}
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-semibold text-sm mb-2 line-clamp-2">{property.title}</h4>
                        <div className="flex items-center text-gray-500 text-xs mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="line-clamp-1">{property.location}</span>
                        </div>
                        <div className="flex gap-2 text-xs text-gray-600">
                          <span>{property.area}m²</span>
                          {property.bedrooms && <span>• {property.bedrooms} PN</span>}
                          {property.bathrooms && <span>• {property.bathrooms} WC</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filteredProperties.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Không tìm thấy bất động sản phù hợp</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <MobileNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">So sánh bất động sản</h1>
              <p className="text-sm text-gray-600">{compareList.length}/4 bất động sản</p>
            </div>
          </div>
          <div className="flex gap-2">
            {compareList.length < 4 && (
              <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Thêm
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-500">
              <Trash2 className="w-4 h-4 mr-1" />
              Xóa tất cả
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Mobile View - Stack Cards */}
        <div className="block lg:hidden space-y-4">
          {compareList.map((property, index) => (
            <Card key={property.id} className="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full w-8 h-8 p-0"
                onClick={() => removeFromCompare(property.id)}
              >
                <X className="w-4 h-4 text-gray-600" />
              </Button>

              <div className="relative h-48">
                <Image
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute bottom-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-sm font-bold">
                  {property.price}
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{property.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{property.location}</span>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Ruler className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="text-sm font-semibold">{property.area}m²</div>
                      <div className="text-xs text-gray-500">Diện tích</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Bed className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="text-sm font-semibold">{property.bedrooms}</div>
                      <div className="text-xs text-gray-500">Phòng ngủ</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Bath className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="text-sm font-semibold">{property.bathrooms}</div>
                      <div className="text-xs text-gray-500">Phòng tắm</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Car className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="text-sm font-semibold">{property.parking}</div>
                      <div className="text-xs text-gray-500">Chỗ đậu xe</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Info */}
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Loại hình:</span>
                      <span className="ml-2 font-medium">{propertyTypeNames[property.propertyType]}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Số tầng:</span>
                      <span className="ml-2 font-medium">{property.floor} tầng</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Hướng nhà:</span>
                      <span className="ml-2 font-medium">{property.direction}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Năm xây:</span>
                      <span className="ml-2 font-medium">{property.yearBuilt}</span>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-gray-500">Giá/m²:</span>
                    <span className="ml-2 font-medium text-blue-600">
                      {(property.pricePerM2 / 1000000).toFixed(1)} triệu/m²
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-500">Pháp lý:</span>
                    <Badge variant="outline" className="ml-2 text-green-600 border-green-200 bg-green-50">
                      <Shield className="w-3 h-3 mr-1" />
                      {property.legal}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop View - Comparison Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-6 font-bold text-gray-900 bg-gray-50/50">Tiêu chí so sánh</th>
                  {compareList.map((property) => (
                    <th key={property.id} className="text-left p-6 min-w-[280px] bg-gray-50/50">
                      <div className="relative">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-0 right-0 rounded-full w-8 h-8 p-0 hover:bg-red-50 text-red-500"
                          onClick={() => removeFromCompare(property.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Image
                          src={property.image || "/placeholder.svg"}
                          alt={property.title}
                          width={260}
                          height={140}
                          className="w-full h-36 object-cover rounded-xl mb-3"
                        />
                        <h3 className="font-bold text-sm line-clamp-2 pr-8">{property.title}</h3>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/30">Giá bán</td>
                  {compareList.map((property) => (
                    <td key={property.id} className="p-6">
                      <span
                        className={`text-blue-600 font-bold text-xl ${getHighlightClass(property, "price", compareList)}`}
                      >
                        {property.price}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/30">Vị trí</td>
                  {compareList.map((property) => (
                    <td key={property.id} className="p-6 text-sm">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        {property.location}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/30">Diện tích</td>
                  {compareList.map((property) => (
                    <td key={property.id} className="p-6">
                      <div className="flex items-center">
                        <Ruler className="w-4 h-4 text-blue-500 mr-2" />
                        <span className={`font-medium ${getHighlightClass(property, "area", compareList)}`}>
                          {property.area}m²
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/30">Giá/m²</td>
                  {compareList.map((property) => (
                    <td key={property.id} className="p-6">
                      <span
                        className={`font-medium text-orange-600 ${getHighlightClass(property, "pricePerM2", compareList)}`}
                      >
                        {(property.pricePerM2 / 1000000).toFixed(1)} triệu/m²
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/30">Phòng ngủ</td>
                  {compareList.map((property) => (
                    <td key={property.id} className="p-6">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 text-green-500 mr-2" />
                        <span className={`font-medium ${getHighlightClass(property, "bedrooms", compareList)}`}>
                          {property.bedrooms}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/30">Phòng tắm</td>
                  {compareList.map((property) => (
                    <td key={property.id} className="p-6">
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 text-purple-500 mr-2" />
                        <span className={`font-medium ${getHighlightClass(property, "bathrooms", compareList)}`}>
                          {property.bathrooms}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/30">Số tầng</td>
                  {compareList.map((property) => (
                    <td key={property.id} className="p-6">
                      <span className={`font-medium ${getHighlightClass(property, "floor", compareList)}`}>
                        {property.floor} tầng
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/30">Hướng nhà</td>
                  {compareList.map((property) => (
                    <td key={property.id} className="p-6">
                      <span className="font-medium">{property.direction}</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/30">Năm xây dựng</td>
                  {compareList.map((property) => (
                    <td key={property.id} className="p-6">
                      <span className={`font-medium ${getHighlightClass(property, "yearBuilt", compareList)}`}>
                        {property.yearBuilt}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/30">Chỗ đậu xe</td>
                  {compareList.map((property) => (
                    <td key={property.id} className="p-6">
                      <div className="flex items-center">
                        <Car className="w-4 h-4 text-orange-500 mr-2" />
                        <span className={`font-medium ${getHighlightClass(property, "parking", compareList)}`}>
                          {property.parking} xe
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/30">Pháp lý</td>
                  {compareList.map((property) => (
                    <td key={property.id} className="p-6">
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        <Shield className="w-3 h-3 mr-1" />
                        {property.legal}
                      </Badge>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add More Button */}
        {compareList.length < 4 && (
          <div className="mt-8 text-center">
            <Button onClick={() => setShowAddModal(true)} variant="outline" size="lg" className="rounded-xl px-8">
              <Plus className="w-5 h-5 mr-2" />
              Thêm bất động sản để so sánh ({compareList.length}/4)
            </Button>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Chọn bất động sản để so sánh</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm bất động sản..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProperties.map((property) => (
                  <Card
                    key={property.id}
                    className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-200"
                    onClick={() => addToCompare(property)}
                  >
                    <div className="relative">
                      <Image
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        width={300}
                        height={150}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full w-8 h-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(property.id)
                        }}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.includes(property.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                          }`}
                        />
                      </Button>
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        {property.price}
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-semibold text-sm mb-2 line-clamp-2">{property.title}</h4>
                      <div className="flex items-center text-gray-500 text-xs mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>
                      <div className="flex gap-2 text-xs text-gray-600">
                        <span>{property.area}m²</span>
                        {property.bedrooms && <span>• {property.bedrooms} PN</span>}
                        {property.bathrooms && <span>• {property.bathrooms} WC</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredProperties.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Không tìm thấy bất động sản phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <MobileNavigation />
    </div>
  )
}
