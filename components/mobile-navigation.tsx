"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Heart, User } from "lucide-react"

const navigationItems = [
  {
    name: "Trang chủ",
    href: "/",
    icon: Home,
  },
  {
    name: "Yêu thích",
    href: "/favorites",
    icon: Heart,
  },
  {
    name: "Cá nhân",
    href: "/profile",
    icon: User,
  },
]

export default function MobileNavigation() {
  const pathname = usePathname()

  return (
    <div className="px-2 py-1">
      <div className="flex justify-around items-center">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all duration-200 min-w-0 ${
                isActive
                  ? "text-white bg-white/20 backdrop-blur-sm scale-105"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className={`w-5 h-5 mb-0.5 ${isActive ? "scale-110" : ""} transition-transform`} />
              <span className={`text-[10px] font-medium leading-tight ${isActive ? "font-semibold" : ""}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export { MobileNavigation }
