"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Eye, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const newsCategories = [
  { id: "all", name: "Tất cả", active: true },
  { id: "market", name: "Thị trường", active: false },
  { id: "policy", name: "Chính sách", active: false },
  { id: "investment", name: "Đầu tư", active: false },
  { id: "project", name: "Dự án", active: false },
]

const newsData = [
  {
    id: 1,
    title: "Tuyến metro số 1 Bến Thành - Suối Tiên chính thức vận hành",
    description:
      "Tuyến metro số 1 Bến Thành - Suối Tiên - Điểm nhấn mới của TP.HCM sau 10 năm chờ đợi. Tuyến metro số 1 Bến Thành - Suối Tiên là dự án được mong đợi nhất của người dân TP.HCM trong nhiều năm qua.",
    image: "/placeholder.svg?height=200&width=300&text=Metro+Line",
    category: "Dự án",
    timeAgo: "2 năm trước",
    views: "15.2K",
    featured: true,
  },
  {
    id: 2,
    title: "2022 Nhà nước sẽ thu hồi đất mà không được bồi thường theo 22 trường hợp",
    description:
      "Căn cứ vào quy định tại Điều 82 Luật Đất đai 2013, quy định đối với các trường hợp thu hồi đất mà không được bồi thường theo 22 trường hợp được quy định cụ thể.",
    image: "/placeholder.svg?height=200&width=300&text=Land+Law",
    category: "Chính sách",
    timeAgo: "3 năm trước",
    views: "8.7K",
    featured: false,
  },
  {
    id: 3,
    title: "Lễ hội nhạc nước hoành tráng bậc nhất Đông Nam Á",
    description:
      "Sự kiện khai trương lễ hội nhạc nước lớn nhất DNA tại dự án The Global City quy tụ dàn Sao khủng. Sự kiện tối 1/9 đã chính thức mở màn lễ hội nhạc nước hoành tráng.",
    image: "/placeholder.svg?height=200&width=300&text=Water+Music",
    category: "Dự án",
    timeAgo: "3 năm trước",
    views: "12.1K",
    featured: false,
  },
  {
    id: 4,
    title: "Phân biệt các loại sổ đỏ, sổ hồng, giấy chứng nhận quyền sử dụng đất",
    description:
      'Nhắc đến "giấy tờ nhà đất" có lẽ nhiều người thường nghĩ tới nhiều loại được nhắc tới phổ biến như "Sổ đỏ", "sổ hồng", và ít phổ biến hơn là "sổ trắng".',
    image: "/placeholder.svg?height=200&width=300&text=Property+Certificate",
    category: "Pháp lý",
    timeAgo: "3 năm trước",
    views: "9.3K",
    featured: false,
  },
  {
    id: 5,
    title: "GS. ĐH Harvard đề nghị Việt Nam nên làm gì để hút được vốn FDI",
    description:
      "Với đặc thù có nhiều tỉnh thành ở khu vực xa không có cơ sở hạ tầng thuận lợi, khó tiếp cận và thu hút vốn FDI, GS. David Dapice đề nghị Việt Nam cần có chiến lược phù hợp.",
    image: "/placeholder.svg?height=200&width=300&text=Harvard+Professor",
    category: "Đầu tư",
    timeAgo: "3 năm trước",
    views: "6.8K",
    featured: false,
  },
  {
    id: 6,
    title: "Giá nhà đất TP.HCM tăng mạnh trong quý III/2024",
    description:
      "Theo báo cáo thị trường bất động sản quý III/2024, giá nhà đất tại TP.HCM tiếp tục có xu hướng tăng mạnh, đặc biệt ở các khu vực trung tâm và có hạ tầng phát triển.",
    image: "/placeholder.svg?height=200&width=300&text=HCMC+Prices",
    category: "Thị trường",
    timeAgo: "1 tháng trước",
    views: "18.5K",
    featured: true,
  },
]

export default function NewsPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Tin tức bất động sản</h1>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {newsCategories.map((category) => (
            <Badge
              key={category.id}
              variant={category.active ? "default" : "outline"}
              className={`whitespace-nowrap px-4 py-2 rounded-full ${
                category.active ? "bg-blue-600 text-white" : "bg-white/80 text-gray-600 border-gray-200"
              }`}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="p-4 pt-6 pb-8 space-y-12">
        {/* Featured News */}
        {newsData
          .filter((news) => news.featured)
          .map((news) => (
            <Link key={news.id} href={`/news/${news.id}`} className="block mb-8">
              <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
                <div className="relative">
                  <Image
                    src={news.image || "/placeholder.svg"}
                    alt={news.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-500 text-white">Nổi bật</Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs">
                    <Eye className="w-3 h-3" />
                    {news.views}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {news.category}
                    </Badge>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {news.timeAgo}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{news.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{news.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}

        {/* Regular News */}
        <div className="space-y-10">
          {newsData
            .filter((news) => !news.featured)
            .map((news) => (
              <Link key={news.id} href={`/news/${news.id}`}>
                <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="flex gap-3 p-3 my-0 my-2 my-2.5 my-0.5 my-0 my-1 my-0">
                      <Image
                        src={news.image || "/placeholder.svg"}
                        alt={news.title}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {news.category}
                          </Badge>
                          <div className="flex items-center text-gray-500 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {news.timeAgo}
                          </div>
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-gray-900">{news.title}</h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">{news.description}</p>
                        <div className="flex items-center text-gray-400 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          {news.views} lượt xem
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </div>

      {/* Custom Bottom Bar - thay thế MobileNavigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Link href="/consultation" className="flex-1">
            <Button className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Yêu cầu tư vấn
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
