import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Inter } from "next/font/google"

import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/contexts/toast-context"
import { DataProvider } from "@/contexts/data-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { MobileNavigation } from "@/components/mobile-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tìm Bất Động Sản",
  description:
    "Tìm bất động sản ra đơi với mong muốn định hình lại cách thức tìm kiếm bất động sản, 100% tin đăng được xác minh, và môi giới được xác thực, am hiểu định giá, và địa phương giúp khách hàng an tâm khi giao dịch bất đông sản",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://timbatdongsan.com.vn/s2cpanel/uploads/2022/03/favicon.jpg"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <DataProvider>
              {/* Anything that calls router hooks must be inside Suspense so
                static pages like /404 can be prerendered safely */}
              <Suspense fallback={null}>
                <DataProvider>
                  <FavoritesProvider>
                    <div className="min-h-screen bg-background">
                      {children}
                      <MobileNavigation />
                    </div>
                  </FavoritesProvider>
                </DataProvider>
              </Suspense>
            </DataProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
