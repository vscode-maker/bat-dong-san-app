"use client"

import { useMemo } from "react"
import { useAppData } from "@/contexts/data-context"

export interface Project {
  id: string
  title: string
  description: string
  price: number
  priceText: string
  currency: string
  project_type: string
  status: string
  area: number
  units: number
  launch_date: string
  completion_date: string
  address: string
  location: string
  district: string
  city: string
  province: string
  latitude?: number | null
  longitude?: number | null
  developer: string
  images: string[]
  image: string
  features: string[]
  amenities: string[]
  created_at: string
  updated_at: string
  views: number
  is_featured: boolean
  is_hot: boolean
  badge: string
  badgeColor: string
}

export interface ProjectFilters {
  project_type?: string
  status?: string
  developer?: string
  district?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  featured?: boolean
  limit?: number
}

export function useProjects(filters?: ProjectFilters) {
  const { getProjects, loading, errors } = useAppData()

  const projects = useMemo(() => {
    return getProjects(filters)
  }, [getProjects, filters])

  return {
    projects,
    loading: loading.projects,
    error: errors.projects,
    refetch: () => {}, // Will be handled by global refresh
  }
}

// Hook for featured projects
export function useFeaturedProjects(limit = 10) {
  return useProjects({ featured: true, limit })
}

// Hook for single project
export function useProject(id: string) {
  const { getProject, loading, errors } = useAppData()

  const project = useMemo(() => {
    return getProject(id)
  }, [getProject, id])

  return {
    project,
    loading: loading.projects,
    error: errors.projects,
  }
}

// Hook for projects by status
export function useProjectsByStatus(status: string, limit?: number) {
  return useProjects({ status, limit })
}

// Hook for projects by developer
export function useProjectsByDeveloper(developer: string, limit?: number) {
  return useProjects({ developer, limit })
}
