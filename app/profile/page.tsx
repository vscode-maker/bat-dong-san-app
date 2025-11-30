"use client"
import Link from "next/link"
import {
  Bookmark,
  Heart,
  MapPin,
  Calendar,
  Crown,
  Star,
  Users,
  TrendingUp,
  Loader2,
  ArrowLeft,
  Phone,
  Mail,
  User,
  Briefcase,
  LogOut,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MobileNavigation from "@/components/mobile-navigation"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"

export default function ProfilePage() {
  const { userId, userData, loading, isAuthenticated, logout, refreshUserData } = useAuth()

  /* -------------------------------------------------------------------------- */
  /*  Guest user handling (no localStorage ID)                                 */
  /* -------------------------------------------------------------------------- */
  if (!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white border-b p-4 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Cá nhân</h1>
            <p className="text-sm text-gray-600 mt-1">Chế độ khách</p>
          </div>
        </header>

        <div className="p-4 text-center space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 p-6 text-white shadow-xl">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" />

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                K
              </div>
              <h3 className="text-xl font-bold mb-2">Khách</h3>
              <p className="text-gray-100 text-sm mb-4">Bạn đang ở chế độ khách</p>
              <p className="text-xs text-gray-200">Không tìm thấy thông tin đăng nhập trong localStorage</p>
            </div>
          </div>
        </div>

        <MobileNavigation />
      </div>
    )
  }

  /* -------------------------------------------------------------------------- */
  /*  Loading state                                                             */
  /* -------------------------------------------------------------------------- */
  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white border-b p-4 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Cá nhân</h1>
            <p className="text-sm text-gray-600 mt-1">
              {loading ? "Đang kiểm tra đăng nhập..." : `Đang tải thông tin user ${userId}...`}
            </p>
          </div>
        </header>

        <div className="p-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00294d] via-[#003d6b] to-[#004d84] p-6 text-white shadow-xl flex items-center justify-center h-32">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-sm">{loading ? "Kiểm tra localStorage..." : "Đang tải thông tin..."}</p>
            </div>
          </div>
        </div>

        <MobileNavigation />
      </div>
    )
  }

  /* -------------------------------------------------------------------------- */
  /*  Main render with cached user data                                        */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b p-4 flex items-center gap-3">
        <Link href={`/?id=${userId}`} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Cá nhân</h1>
          <p className="text-sm text-gray-600 mt-1">Xin chào, {userData.full_name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={refreshUserData}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* ------------------------------------------------------------------ */}
        {/*  User card with real avatar and cached data                       */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00294d] via-[#003d6b] to-[#004d84] p-6 text-white shadow-xl">
          {/* background accents */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" />

          <div className="relative z-10">
            {/* Cache source indicator */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-100">Dữ liệu từ localStorage</span>
              </div>
              <span className="text-xs text-blue-100 bg-white/10 px-2 py-1 rounded">ID: {userId}</span>
            </div>

            {/* avatar + meta with real image */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                {userData.avatar_url &&
                userData.avatar_url !== "/placeholder.svg" &&
                !userData.avatar_url.includes("placeholder") ? (
                  <Image
                    src={userData.avatar_url || "/placeholder.svg"}
                    alt={userData.full_name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full border-4 border-white/20 object-cover shadow-lg"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.currentTarget.style.display = "none"
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement
                      if (fallback) fallback.classList.remove("hidden")
                    }}
                  />
                ) : null}

                <div
                  className={`w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-4 border-white/20 shadow-lg ${
                    userData.avatar_url &&
                    userData.avatar_url !== "/placeholder.svg" &&
                    !userData.avatar_url.includes("placeholder")
                      ? "hidden"
                      : ""
                  }`}
                >
                  {userData.full_name?.charAt(0)?.toUpperCase() || userData.id?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                    userData.is_active ? "bg-green-400" : "bg-gray-400"
                  }`}
                  title={userData.is_active ? "Đang hoạt động" : "Không hoạt động"}
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{userData.full_name}</h3>
                <p className="text-blue-100 text-sm mb-2 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {userData.email}
                </p>

                <div className="flex items-center gap-4 text-xs text-blue-100 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Tham&nbsp;gia&nbsp;{userData.joinYear || new Date(userData.created_at).getFullYear()}
                  </span>

                  {userData.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {userData.city}
                    </span>
                  )}

                  {userData.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {userData.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* User type and status badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium flex items-center gap-1">
                <User className="w-3 h-3" />
                {userData.user_type === "agent"
                  ? "Môi giới"
                  : userData.user_type === "developer"
                    ? "Chủ đầu tư"
                    : userData.user_type === "customer"
                      ? "Khách hàng"
                      : userData.user_type}
              </span>

              {userData.is_vip && (
                <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-xs font-medium flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  VIP
                </span>
              )}

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userData.is_active ? "bg-green-500/20 text-green-100" : "bg-gray-500/20 text-gray-100"
                }`}
              >
                {userData.is_active ? "Hoạt động" : "Không hoạt động"}
              </span>

              {userData.gender && (
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
                  {userData.gender === "male" ? "Nam" : userData.gender === "female" ? "Nữ" : userData.gender}
                </span>
              )}
            </div>

            {/* stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">{userData.total_favorites || 0}</div>
                <p className="text-xs text-blue-100">Tin yêu thích</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userData.total_saved_filters || 0}</div>
                <p className="text-xs text-blue-100">Bộ lọc đã lưu</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userData.total_consultations || 0}</div>
                <p className="text-xs text-blue-100">Tư vấn</p>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/*  User details card with all cached information                     */}
        {/* ------------------------------------------------------------------ */}
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pb-3">
            <CardTitle className="text-lg text-gray-800">Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Full Address */}
            {(userData.address || userData.district || userData.city) && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Địa chỉ</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    {userData.address && <p>{userData.address}</p>}
                    {userData.district && <p>Quận/Huyện: {userData.district}</p>}
                    {userData.city && <p>Thành phố: {userData.city}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Số điện thoại</p>
                    <p className="text-sm text-gray-600">{userData.phone}</p>
                  </div>
                </div>
              )}

              {userData.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.occupation && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Nghề nghiệp</p>
                    <p className="text-sm text-gray-600">{userData.occupation}</p>
                  </div>
                </div>
              )}

              {userData.date_of_birth && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Ngày sinh</p>
                    <p className="text-sm text-gray-600">
                      {new Date(userData.date_of_birth).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Ngày tham gia</p>
                  <p className="text-sm text-gray-600">{new Date(userData.created_at).toLocaleDateString("vi-VN")}</p>
                </div>
              </div>

              {userData.last_login && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Lần cuối truy cập</p>
                    <p className="text-sm text-gray-600">
                      {new Date(userData.last_login).toLocaleDateString("vi-VN")} lúc{" "}
                      {new Date(userData.last_login).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ------------------------------------------------------------------ */}
        {/*  Saved items card with user context                                */}
        {/* ------------------------------------------------------------------ */}
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pb-3">
            <CardTitle className="text-lg text-gray-800">Quản lý mục đã lưu</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Link href={`/favorites?id=${userId}`} className="block">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Tin yêu thích</h3>
                    <p className="text-sm text-gray-600">{userData.total_favorites || 0} bất động sản đã lưu</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">→</div>
              </div>
            </Link>

            <Link href={`/filter?tab=saved&id=${userId}`} className="block">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00294d] to-[#003d6b] flex items-center justify-center">
                    <Bookmark className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Bộ lọc đã lưu</h3>
                    <p className="text-sm text-gray-600">{userData.total_saved_filters || 0} bộ lọc tìm kiếm</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">→</div>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* ------------------------------------------------------------------ */}
        {/*  VIP membership card with expiration info                          */}
        {/* ------------------------------------------------------------------ */}
        <Card
          className={`shadow-xl border-0 rounded-2xl overflow-hidden ${
            userData.is_vip
              ? "bg-gradient-to-br from-amber-50 to-yellow-100"
              : "bg-gradient-to-br from-gray-50 to-gray-100"
          }`}
        >
          <CardHeader
            className={`${
              userData.is_vip
                ? "bg-gradient-to-r from-amber-400 to-yellow-500"
                : "bg-gradient-to-r from-gray-400 to-gray-500"
            } text-white pb-4`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">{userData.is_vip ? "Hội viên VIP" : "Nâng cấp VIP"}</CardTitle>
                <p className={`text-sm ${userData.is_vip ? "text-amber-100" : "text-gray-100"}`}>
                  {userData.is_vip ? "Đang hoạt động" : "Nâng cấp trải nghiệm của bạn"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {userData.is_vip && userData.vip_expires_at && (
              <div className="bg-white rounded-lg p-3 border border-amber-200 text-center text-sm text-amber-800">
                <p className="font-medium">VIP hết hạn:</p>
                <p className="text-lg font-bold">{new Date(userData.vip_expires_at).toLocaleDateString("vi-VN")}</p>
                <p className="text-xs mt-1">
                  Còn{" "}
                  {Math.ceil(
                    (new Date(userData.vip_expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )}{" "}
                  ngày
                </p>
              </div>
            )}

            {/* Benefits list */}
            {[
              ["Tham gia group VIP tư vấn độc quyền", Users],
              ["Phân tích BĐS tiềm năng từ chuyên gia", TrendingUp],
              ["Ưu tiên hỗ trợ 24/7", Star],
            ].map(([label, Icon]) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${
                    userData.is_vip ? "bg-amber-100" : "bg-gray-100"
                  } flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${userData.is_vip ? "text-amber-600" : "text-gray-600"}`} />
                </div>
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            ))}

            {!userData.is_vip ? (
              <>
                <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-gray-900">200.000đ</div>
                  <div className="text-sm text-gray-600">/ tháng</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center text-xs text-gray-800">
                  <span className="font-medium">Lưu ý:</span>&nbsp;Đăng ký sẽ được xét duyệt trong vòng 24&nbsp;h
                </div>

                <Button className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 rounded-xl shadow-lg">
                  <Crown className="w-4 h-4 mr-2" />
                  Đăng ký hội viên VIP
                </Button>
              </>
            ) : (
              <p className="text-center text-sm font-medium text-amber-700">🎉 Cảm ơn bạn đã là thành viên VIP!</p>
            )}
          </CardContent>
        </Card>
      </div>

      <MobileNavigation />
    </div>
  )
}
