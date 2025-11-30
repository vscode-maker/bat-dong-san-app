import { Suspense } from "react"
import FilterContent from "./filter-content"

// Force dynamic rendering - Server Component
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

function FilterPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-20">
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 h-6 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 space-y-3 shadow-sm">
            <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FilterPage() {
  return (
    <Suspense fallback={<FilterPageSkeleton />}>
      <FilterContent />
    </Suspense>
  )
}
