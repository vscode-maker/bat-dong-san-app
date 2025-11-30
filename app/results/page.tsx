"use client"

import { useSearchParams } from "next/navigation"
import { useProperties } from "@/hooks/useProperties"
import type { PropertyFilters } from "@/types"
import PropertyCard from "@/components/property-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo, Suspense } from "react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

function ResultsPageContent() {
  const searchParams = useSearchParams()

  const filters = useMemo<PropertyFilters>(() => {
    const sp = new URLSearchParams(searchParams.toString())
    return {
      transactionType: sp.get("type") ?? undefined,
      propertyType: sp.get("propertyType") ?? undefined,
      minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
      maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
      bedrooms: sp.get("bedrooms") ? sp.get("bedrooms")!.split(",").map(Number) : undefined,
      bathrooms: sp.get("bathrooms") ? sp.get("bathrooms")!.split(",").map(Number) : undefined,
      minArea: sp.get("minArea") ? Number(sp.get("minArea")) : undefined,
      maxArea: sp.get("maxArea") ? Number(sp.get("maxArea")) : undefined,
      district: sp.get("district") ?? undefined,
      city: sp.get("city") ?? undefined,
      direction: sp.get("direction") ? sp.get("direction")!.split(",") : undefined,
      legal: sp.get("legal") ? sp.get("legal")!.split(",") : undefined,
      search: sp.get("q") ?? undefined,
    }
  }, [searchParams])

  const { properties, loading, error } = useProperties(filters)

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {properties?.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <ResultsPageContent />
    </Suspense>
  )
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}
