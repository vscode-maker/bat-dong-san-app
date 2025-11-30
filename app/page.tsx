import { Suspense } from "react"
import HomeContent from "./home-content"

// Force dynamic rendering - Server Component
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-20">
      <div className="gradient-primary text-white p-4 pb-6 shadow-xl">
        <div className="h-10 bg-white/20 rounded-lg animate-pulse mb-4" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white/10 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-white rounded-xl animate-pulse shadow-sm" />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent />
    </Suspense>
  )
}
