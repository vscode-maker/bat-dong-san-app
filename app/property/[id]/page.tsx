import { Suspense } from "react"
import PropertyContent from "./property-content"

// Force dynamic rendering - this must be in a Server Component
export const dynamic = 'force-dynamic'

function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 animate-pulse">
      <div className="relative h-80 bg-gray-300" />
      <div className="p-4 space-y-4">
        <div className="h-6 w-3/4 bg-gray-300 rounded" />
        <div className="h-8 w-1/3 bg-gray-300 rounded" />
        <div className="h-4 w-1/2 bg-gray-300 rounded" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-300 rounded" />
          ))}
        </div>
        <div className="h-32 bg-gray-300 rounded" />
      </div>
    </div>
  )
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<PropertyDetailSkeleton />}>
      <PropertyContent propertyId={params.id} />
    </Suspense>
  )
}
