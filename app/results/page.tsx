import { Suspense } from "react"
import ResultsContent from "./results-content"

// Force dynamic rendering - Server Component
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-40 w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
        </div>
      ))}
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <ResultsContent />
    </Suspense>
  )
}
