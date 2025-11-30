"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Ruler,
  Building,
  Users,
  Car,
  Shield,
  Wifi,
  Dumbbell,
  ShoppingCart,
  GraduationCap,
  Hospital,
  TreePine,
  Waves,
  Star,
  Clock,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProject } from "@/hooks/useProjects"

// Mock project data
// const projectData = {
//   id: 1,
//   title: "Vinhomes Thăng Long - Viên ngọc sáng giữa lòng Thủ đô",
//   developer: "Vingroup",
//   price: "70 triệu",
//   priceRange: "45 - 120 triệu",
//   priceLabel: "Đã bán giao",
//   area: "24,23 ha",
//   totalUnits: "2.500 căn",
//   launchDate: "06/06/2023",
//   handoverDate: "Q4/2024",
//   location: "Đường Phố Đông, Xã An Khánh, Hoài Đức, Hà Nội",
//   status: "Đã bán giao",
//   completionRate: 95,
//   images: [
//     "/placeholder.svg?height=400&width=600&text=Tổng+quan+dự+án",
//     "/placeholder.svg?height=400&width=600&text=Khu+biệt+thự",
//     "/placeholder.svg?height=400&width=600&text=Khu+căn+hộ",
//     "/placeholder.svg?height=400&width=600&text=Tiện+ích+nội+khu",
//     "/placeholder.svg?height=400&width=600&text=Cảnh+quan+xanh",
//     "/placeholder.svg?height=400&width=600&text=Hồ+bơi+trung+tâm",
//   ],
//   description: `
//     Vinhomes Thăng Long là dự án khu đô thị phức hợp cao cấp được phát triển bởi Vingroup tại Hà Nội.
//     Dự án được thiết kế theo mô hình "thành phố trong thành phố" với đầy đủ tiện ích hiện đại.

//     🏗️ THÔNG TIN DỰ ÁN:
//     - Tổng diện tích: 24,23 ha
//     - Tổng số căn: 2.500 căn hộ và biệt thự
//     - Mật độ xây dựng: 35%
//     - Tỷ lệ cây xanh: 65%

//     🌟 ĐIỂM NỔI BẬT:
//     - Vị trí đắc địa, kết nối thuận lợi
//     - Thiết kế hiện đại, sang trọng
//     - Hệ thống tiện ích đẳng cấp 5 sao
//     - An ninh 24/7 với công nghệ thông minh

//     🏡 SẢN PHẨM:
//     - Căn hộ: 1-4 phòng ngủ (45-150m²)
//     - Biệt thự: 3-5 phòng ngủ (200-400m²)
//     - Shophouse: Kinh doanh + ở (120-200m²)
//   `,
//   amenities: [
//     { name: "Hồ bơi trung tâm", icon: Waves, category: "Giải trí" },
//     { name: "Phòng gym hiện đại", icon: Dumbbell, category: "Thể thao" },
//     { name: "Khu vui chơi trẻ em", icon: Users, category: "Gia đình" },
//     { name: "Trung tâm thương mại", icon: ShoppingCart, category: "Mua sắm" },
//     { name: "Trường học quốc tế", icon: GraduationCap, category: "Giáo dục" },
//     { name: "Bệnh viện đa khoa", icon: Hospital, category: "Y tế" },
//     { name: "Công viên cây xanh", icon: TreePine, category: "Môi trường" },
//     { name: "Bãi đỗ xe ngầm", icon: Car, category: "Tiện ích" },
//     { name: "WiFi miễn phí", icon: Wifi, category: "Công nghệ" },
//     { name: "An ninh 24/7", icon: Shield, category: "An ninh" },
//   ],
//   masterPlan: {
//     totalArea: "24,23 ha",
//     buildingDensity: "35%",
//     greenSpace: "65%",
//     zones: [
//       { name: "Khu căn hộ cao tầng", area: "8,5 ha", units: "1.800 căn" },
//       { name: "Khu biệt thự", area: "6,2 ha", units: "200 căn" },
//       { name: "Khu shophouse", area: "2,8 ha", units: "500 căn" },
//       { name: "Tiện ích trung tâm", area: "4,2 ha", description: "Hồ bơi, gym, spa" },
//       { name: "Công viên cây xanh", area: "2,53 ha", description: "Hồ điều hòa, sân chơi" },
//     ],
//   },
//   paymentPlan: [
//     { phase: "Đặt chỗ", percentage: "2%", description: "Ký hợp đồng đặt chỗ" },
//     { phase: "Ký HĐMB", percentage: "13%", description: "Ký hợp đồng mua bán chính thức" },
//     { phase: "Hoàn thiện thô", percentage: "25%", description: "Khi dự án hoàn thiện phần thô" },
//     { phase: "Hoàn thiện nội thất", percentage: "25%", description: "Khi hoàn thiện nội thất cơ bản" },
//     { phase: "Bàn giao", percentage: "35%", description: "Khi nhận bàn giao căn hộ" },
//   ],
//   contact: {
//     name: "Ms. Linh",
//     title: "Chuyên viên tư vấn dự án",
//     phone: "0901234567",
//     email: "linh.vinhomes@email.com",
//     avatar: "/placeholder.svg?height=60&width=60&text=ML",
//   },
//   nearbyProjects: [
//     {
//       id: 2,
//       title: "Vinhomes Smart City",
//       price: "55 triệu",
//       location: "Tây Mỗ, Nam Từ Liêm, Hà Nội",
//       distance: "3.2 km",
//       image: "/placeholder.svg?height=100&width=150&text=Smart+City",
//       status: "Đang bán",
//     },
//     {
//       id: 3,
//       title: "The Manor Central Park",
//       price: "85 triệu",
//       location: "Nguyễn Xiển, Thanh Xuân, Hà Nội",
//       distance: "5.8 km",
//       image: "/placeholder.svg?height=100&width=150&text=Manor+Central",
//       status: "Sắp mở bán",
//     },
//     {
//       id: 4,
//       title: "Sunshine City",
//       price: "42 triệu",
//       location: "Ciputra, Tây Hồ, Hà Nội",
//       distance: "7.1 km",
//       image: "/placeholder.svg?height=100&width=150&text=Sunshine+City",
//       status: "Đang bán",
//     },
//   ],
//   investmentHighlights: [
//     {
//       title: "Vị trí đắc địa",
//       description: "Kết nối trực tiếp với trung tâm Hà Nội qua đường vành đai 3",
//       icon: MapPin,
//     },
//     {
//       title: "Tiềm năng tăng giá",
//       description: "Dự kiến tăng 15-20% mỗi năm theo quy hoạch khu vực",
//       icon: TrendingUp,
//     },
//     {
//       title: "Chủ đầu tư uy tín",
//       description: "Vingroup - Tập đoàn bất động sản hàng đầu Việt Nam",
//       icon: Star,
//     },
//     {
//       title: "Pháp lý minh bạch",
//       description: "Sổ hồng lâu dài, thủ tục nhanh chóng",
//       icon: CheckCircle,
//     },
//   ],
// }

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Fetch project data từ API
  const { project, loading, error } = useProject(params.id)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin dự án...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Không thể tải thông tin dự án</p>
          <p className="text-gray-500 text-sm mb-4">{error || "Dự án không tồn tại"}</p>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    )
  }

  // Map project data to display format
  const projectData = {
    id: project.id,
    title: project.title,
    developer: project.developer,
    price: project.priceText,
    priceRange: `${((project.price * 0.7) / 1000000).toFixed(0)} - ${((project.price * 1.3) / 1000000).toFixed(0)} triệu`,
    priceLabel:
      project.status === "completed"
        ? "Đã bán giao"
        : project.status === "selling"
          ? "Đang mở bán"
          : project.status === "upcoming"
            ? "Sắp mở bán"
            : "Đang cập nhật",
    area: `${(project.area / 10000).toFixed(2)} ha`,
    totalUnits: `${project.units.toLocaleString()} căn`,
    launchDate: project.launch_date,
    handoverDate: project.completion_date || "Đang cập nhật",
    location: project.location,
    status:
      project.status === "completed"
        ? "Đã bán giao"
        : project.status === "selling"
          ? "Đang mở bán"
          : project.status === "upcoming"
            ? "Sắp mở bán"
            : "Đang cập nhật",
    completionRate:
      project.status === "completed"
        ? 100
        : project.status === "selling"
          ? 75
          : project.status === "upcoming"
            ? 25
            : 50,
    images:
      project.images.length > 0
        ? project.images
        : [
            "/placeholder.svg?height=400&width=600&text=Tổng+quan+dự+án",
            "/placeholder.svg?height=400&width=600&text=Khu+biệt+thự",
            "/placeholder.svg?height=400&width=600&text=Khu+căn+hộ",
            "/placeholder.svg?height=400&width=600&text=Tiện+ích+nội+khu",
            "/placeholder.svg?height=400&width=600&text=Cảnh+quan+xanh",
            "/placeholder.svg?height=400&width=600&text=Hồ+bơi+trung+tâm",
          ],
    description:
      project.description ||
      `
      ${project.title} là dự án ${
        project.project_type === "residential"
          ? "khu đô thị phức hợp cao cấp"
          : project.project_type === "smart_city"
            ? "thành phố thông minh"
            : project.project_type === "land"
              ? "khu dân cư đất nền"
              : "dự án bất động sản"
      } 
      được phát triển bởi ${project.developer}.
      
      🏗️ THÔNG TIN DỰ ÁN:
      - Tổng diện tích: ${(project.area / 10000).toFixed(2)} ha
      - Tổng số căn: ${project.units.toLocaleString()} căn
      - Mật độ xây dựng: 35%
      - Tỷ lệ cây xanh: 65%
      
      🌟 ĐIỂM NỔI BẬT:
      - Vị trí đắc địa, kết nối thuận lợi
      - Thiết kế hiện đại, sang trọng
      - Hệ thống tiện ích đẳng cấp 5 sao
      - An ninh 24/7 với công nghệ thông minh
      
      🏡 SẢN PHẨM:
      - Đa dạng loại hình từ căn hộ đến biệt thự
      - Thiết kế tối ưu không gian sống
      - Hoàn thiện cao cấp
    `,
    amenities:
      project.amenities.length > 0
        ? project.amenities.map((amenity, index) => ({
            name: amenity,
            icon: [Waves, Dumbbell, Users, ShoppingCart, GraduationCap, Hospital, TreePine, Car, Wifi, Shield][
              index % 10
            ],
            category:
              index % 5 === 0
                ? "Giải trí"
                : index % 5 === 1
                  ? "Thể thao"
                  : index % 5 === 2
                    ? "Gia đình"
                    : index % 5 === 3
                      ? "Mua sắm"
                      : "Tiện ích",
          }))
        : [
            { name: "Hồ bơi trung tâm", icon: Waves, category: "Giải trí" },
            { name: "Phòng gym hiện đại", icon: Dumbbell, category: "Thể thao" },
            { name: "Khu vui chơi trẻ em", icon: Users, category: "Gia đình" },
            { name: "Trung tâm thương mại", icon: ShoppingCart, category: "Mua sắm" },
            { name: "Trường học quốc tế", icon: GraduationCap, category: "Giáo dục" },
            { name: "Bệnh viện đa khoa", icon: Hospital, category: "Y tế" },
            { name: "Công viên cây xanh", icon: TreePine, category: "Môi trường" },
            { name: "Bãi đỗ xe ngầm", icon: Car, category: "Tiện ích" },
            { name: "WiFi miễn phí", icon: Wifi, category: "Công nghệ" },
            { name: "An ninh 24/7", icon: Shield, category: "An ninh" },
          ],
    masterPlan: {
      totalArea: `${(project.area / 10000).toFixed(2)} ha`,
      buildingDensity: "35%",
      greenSpace: "65%",
      zones: [
        {
          name: project.project_type === "land" ? "Khu đất nền" : "Khu căn hộ cao tầng",
          area: `${((project.area * 0.35) / 10000).toFixed(1)} ha`,
          units: `${Math.floor(project.units * 0.7).toLocaleString()} căn`,
        },
        {
          name: project.project_type === "smart_city" ? "Khu thương mại" : "Khu biệt thự",
          area: `${((project.area * 0.25) / 10000).toFixed(1)} ha`,
          units: `${Math.floor(project.units * 0.2).toLocaleString()} căn`,
        },
        {
          name: "Khu shophouse",
          area: `${((project.area * 0.15) / 10000).toFixed(1)} ha`,
          units: `${Math.floor(project.units * 0.1).toLocaleString()} căn`,
        },
        {
          name: "Tiện ích trung tâm",
          area: `${((project.area * 0.15) / 10000).toFixed(1)} ha`,
          description: "Hồ bơi, gym, spa",
        },
        {
          name: "Công viên cây xanh",
          area: `${((project.area * 0.1) / 10000).toFixed(1)} ha`,
          description: "Hồ điều hòa, sân chơi",
        },
      ],
    },
    paymentPlan: [
      { phase: "Đặt chỗ", percentage: "2%", description: "Ký hợp đồng đặt chỗ" },
      { phase: "Ký HĐMB", percentage: "13%", description: "Ký hợp đồng mua bán chính thức" },
      { phase: "Hoàn thiện thô", percentage: "25%", description: "Khi dự án hoàn thiện phần thô" },
      { phase: "Hoàn thiện nội thất", percentage: "25%", description: "Khi hoàn thiện nội thất cơ bản" },
      { phase: "Bàn giao", percentage: "35%", description: "Khi nhận bàn giao căn hộ" },
    ],
    contact: {
      name: "Ms. Linh",
      title: "Chuyên viên tư vấn dự án",
      phone: "0901234567",
      email: "linh.vinhomes@email.com",
      avatar: "/placeholder.svg?height=60&width=60&text=ML",
    },
    nearbyProjects: [
      {
        id: 2,
        title: "Vinhomes Smart City",
        price: "55 triệu",
        location: "Tây Mỗ, Nam Từ Liêm, Hà Nội",
        distance: "3.2 km",
        image: "/placeholder.svg?height=100&width=150&text=Smart+City",
        status: "Đang bán",
      },
      {
        id: 3,
        title: "The Manor Central Park",
        price: "85 triệu",
        location: "Nguyễn Xiển, Thanh Xuân, Hà Nội",
        distance: "5.8 km",
        image: "/placeholder.svg?height=100&width=150&text=Manor+Central",
        status: "Sắp mở bán",
      },
      {
        id: 4,
        title: "Sunshine City",
        price: "42 triệu",
        location: "Ciputra, Tây Hồ, Hà Nội",
        distance: "7.1 km",
        image: "/placeholder.svg?height=100&width=150&text=Sunshine+City",
        status: "Đang bán",
      },
    ],
    investmentHighlights: [
      {
        title: "Vị trí đắc địa",
        description: `Kết nối trực tiếp với ${project.city} qua các tuyến giao thông chính`,
        icon: MapPin,
      },
      {
        title: "Tiềm năng tăng giá",
        description: "Dự kiến tăng 15-20% mỗi năm theo quy hoạch khu vực",
        icon: TrendingUp,
      },
      {
        title: "Chủ đầu tư uy tín",
        description: `${project.developer} - Chủ đầu tư có uy tín trên thị trường`,
        icon: Star,
      },
      {
        title: "Pháp lý minh bạch",
        description: "Sổ hồng lâu dài, thủ tục nhanh chóng",
        icon: CheckCircle,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={projectData.images[currentImageIndex] || "/placeholder.svg"}
            alt={projectData.title}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1}/{projectData.images.length}
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={`${projectData.status === "Đã bán giao" ? "bg-green-500" : "bg-blue-500"} text-white`}>
              {projectData.status}
            </Badge>
          </div>
        </div>

        {/* Image Thumbnails */}
        <div className="flex gap-2 p-4 overflow-x-auto">
          {projectData.images.map((image, index) => (
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
      </div>

      {/* Project Info */}
      <div className="p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {projectData.developer}
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Hoàn thành {projectData.completionRate}%
            </Badge>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-3">{projectData.title}</h1>

          <div className="flex items-center text-gray-600 text-sm mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            {projectData.location}
          </div>

          {/* Price Info */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{projectData.price}</div>
                <div className="text-sm text-blue-500">Giá từ {projectData.priceRange}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Trạng thái</div>
                <div className="font-semibold text-green-600">{projectData.priceLabel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <Ruler className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-sm font-semibold">{projectData.area}</div>
            <div className="text-xs text-gray-500">Tổng diện tích</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <Building className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-sm font-semibold">{projectData.totalUnits}</div>
            <div className="text-xs text-gray-500">Tổng số căn</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-sm font-semibold">{projectData.launchDate}</div>
            <div className="text-xs text-gray-500">Ngày mở bán</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-sm font-semibold">{projectData.handoverDate}</div>
            <div className="text-xs text-gray-500">Bàn giao</div>
          </div>
        </div>

        {/* Investment Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Điểm nổi bật đầu tư
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectData.investmentHighlights.map((highlight, index) => (
                <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <highlight.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{highlight.title}</h4>
                    <p className="text-xs text-gray-600">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for detailed information */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="amenities">Tiện ích</TabsTrigger>
            <TabsTrigger value="masterplan">Mặt bằng</TabsTrigger>
            <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="whitespace-pre-line text-sm text-gray-700">{projectData.description}</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amenities" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projectData.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <amenity.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{amenity.name}</div>
                        <div className="text-xs text-gray-500">{amenity.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="masterplan" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-blue-600">{projectData.masterPlan.totalArea}</div>
                      <div className="text-xs text-gray-600">Tổng diện tích</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-green-600">{projectData.masterPlan.buildingDensity}</div>
                      <div className="text-xs text-gray-600">Mật độ xây dựng</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-emerald-600">{projectData.masterPlan.greenSpace}</div>
                      <div className="text-xs text-gray-600">Cây xanh</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">Phân khu chức năng</h4>
                    {projectData.masterPlan.zones.map((zone, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{zone.name}</div>
                          <div className="text-xs text-gray-600">{zone.description || `${zone.units}`}</div>
                        </div>
                        <div className="text-sm font-semibold text-blue-600">{zone.area}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">Phương thức thanh toán</h4>
                  {projectData.paymentPlan.map((phase, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{phase.percentage}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{phase.phase}</div>
                        <div className="text-xs text-gray-600">{phase.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Location & Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vị trí dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p>Bản đồ vị trí dự án</p>
                <p className="text-sm">{projectData.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dự án lân cận</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectData.nearbyProjects.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={80}
                      height={60}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-1 mb-1">{project.title}</h4>
                      <div className="text-lg font-bold text-blue-600 mb-1">{project.price}</div>
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{project.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Cách {project.distance}</span>
                        <Badge variant="outline" className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={projectData.contact.avatar || "/placeholder.svg"}
                alt={projectData.contact.name}
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <div className="font-semibold">{projectData.contact.name}</div>
                <div className="text-sm text-gray-500">{projectData.contact.title}</div>
                <div className="text-xs text-gray-400">{projectData.contact.email}</div>
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

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Link href="/consultation" className="flex-1">
            <Button className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Đăng ký tư vấn
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
