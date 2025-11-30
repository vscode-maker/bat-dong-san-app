import { Suspense } from "react"
import SearchContent from "./search-content"

// Force dynamic rendering - this must be in a Server Component
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

function SearchPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="p-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="w-full h-48 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchContent />
    </Suspense>
  )
}
