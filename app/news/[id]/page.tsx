"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Eye, Share2, Heart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useNewsArticle } from "@/hooks/useNews"

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { article, loading, error } = useNewsArticle(params.id)

  const relatedNews = [
    {
      id: "2",
      title: "Giá nhà đất khu vực Thủ Đức tăng mạnh sau tin metro hoạt động",
      image: "/placeholder.svg?height=100&width=150&text=Thu+Duc+Prices",
      timeAgo: "1 ngày trước",
    },
    {
      id: "3",
      title: "Các dự án căn hộ dọc tuyến metro số 1 hút khách",
      image: "/placeholder.svg?height=100&width=150&text=Metro+Apartments",
      timeAgo: "3 ngày trước",
    },
  ].filter((news) => news.id !== params.id) // Loại bỏ bài viết hiện tại

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16">
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <Link href="/news">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16">
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <Link href="/news">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy bài viết</h1>
          <p className="text-gray-600 mb-4">Bài viết này có thể đã bị xóa hoặc không tồn tại.</p>
          <Link href="/news">
            <Button>Quay lại danh sách tin tức</Button>
          </Link>
        </div>
      </div>
    )
  }

  const newsDetail = article

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link href="/news">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Article Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-blue-600 text-white">{newsDetail.category}</Badge>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {newsDetail.timeAgo}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Eye className="w-4 h-4 mr-1" />
              {newsDetail.views.toLocaleString()}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{newsDetail.title}</h1>

          <div className="flex items-center text-gray-600 text-sm mb-4">
            <span>Tác giả: {newsDetail.author_id || "Admin"}</span>
            <span className="mx-2">•</span>
            <span>{new Date(newsDetail.published_at || newsDetail.created_at).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-6">
          <Image
            src={newsDetail.featured_image || "/placeholder.svg?height=300&width=600&text=News+Image"}
            alt={newsDetail.title}
            width={600}
            height={300}
            className="w-full h-64 object-cover rounded-2xl"
          />
        </div>

        {/* Article Content */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-6">
            {newsDetail.content ? (
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: newsDetail.content }}
              />
            ) : (
              <div className="text-gray-500 italic">Nội dung bài viết đang được cập nhật...</div>
            )}
          </CardContent>
        </Card>

        {/* Related News */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tin liên quan</h3>
          <div className="space-y-3">
            {relatedNews.map((news) => (
              <Link key={news.id} href={`/news/${news.id}`}>
                <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="flex gap-3 p-3">
                      <Image
                        src={news.image || "/placeholder.svg"}
                        alt={news.title}
                        width={80}
                        height={60}
                        className="w-20 h-15 object-cover rounded-xl flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-2 text-gray-900">{news.title}</h4>
                        <span className="text-xs text-gray-500">{news.timeAgo}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
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
