"use client"

import { useMemo } from "react"
import { useAppData } from "@/contexts/data-context"

export interface Property {
  id: string
  title: string
  description: string
  price: number
  priceText: string
  currency: string
  property_type: string
  propertyType: string
  transaction_type: string
  type: string
  bedrooms: number
  bathrooms: number
  area: number
  address: string
  location: string
  district: string
  city: string
  province: string
  latitude?: number | null
  longitude?: number | null
  direction: string
  legal_status: string
  legal: string
  images: string[]
  image: string
  features: string[]
  status: string
  created_at: string
  updated_at: string
  postedDate: string
  owner_id: string
  agent_id: string
  views: number
  is_featured: boolean
  is_urgent: boolean
}

export interface PropertyFilters {
  propertyType?: string
  transactionType?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number[]
  bathrooms?: number[]
  minArea?: number
  maxArea?: number
  district?: string
  city?: string
  direction?: string[]
  legal?: string[]
  search?: string
  featured?: boolean
}

export function useProperties(filters?: PropertyFilters) {
  const { getProperties, loading, errors } = useAppData()

  const properties = useMemo(() => {
    return getProperties(filters)
  }, [getProperties, filters])

  return {
    properties,
    loading: loading.properties,
    error: errors.properties,
    refetch: () => {}, // Will be handled by global refresh
  }
}

// Hook for rental properties
export function useRentalProperties(filters?: Omit<PropertyFilters, "transactionType">) {
  return useProperties({ ...filters, transactionType: "rent" })
}

// Hook for sale properties
export function useSaleProperties(filters?: Omit<PropertyFilters, "transactionType">) {
  return useProperties({ ...filters, transactionType: "sale" })
}

// Hook for single property
export function useProperty(id: string) {
  const { getProperty, loading, errors } = useAppData()

  const property = useMemo(() => {
    return getProperty(id)
  }, [getProperty, id])

  return {
    property,
    loading: loading.properties,
    error: errors.properties,
  }
}

// Hook for featured properties
export function useFeaturedProperties(limit = 10) {
  return useProperties({ featured: true, limit } as any)
}

// Hook for featured rental properties
export function useFeaturedRentalProperties(limit = 10) {
  return useProperties({ featured: true, transactionType: "rent", limit } as any)
}
