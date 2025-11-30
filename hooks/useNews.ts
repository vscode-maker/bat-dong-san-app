"use client"

import { useMemo } from "react"
import { useAppData } from "@/contexts/data-context"

export interface NewsArticle {
  id: string
  title: string
  content: string
  excerpt: string
  featured_image: string
  category: string
  tags: string[]
  author_id: string
  author: string
  status: string
  published_at: string
  created_at: string
  updated_at: string
  views: number
  is_featured: boolean
  timeAgo: string
}

export function useNews(limit?: number) {
  const { getNews, loading, errors } = useAppData()

  const news = useMemo(() => {
    return getNews({ limit })
  }, [getNews, limit])

  return {
    news,
    loading: loading.news,
    error: errors.news,
    refetch: () => {}, // Will be handled by global refresh
  }
}

// Hook for single news article
export function useNewsArticle(id: string) {
  const { getNewsArticle, loading, errors } = useAppData()

  const article = useMemo(() => {
    return getNewsArticle(id)
  }, [getNewsArticle, id])

  return {
    article,
    loading: loading.news,
    error: errors.news,
  }
}

// Hook for news by category
export function useNewsByCategory(category: string, limit?: number) {
  const { getNews, loading, errors } = useAppData()

  const news = useMemo(() => {
    return getNews({ category, limit })
  }, [getNews, category, limit])

  return {
    news,
    loading: loading.news,
    error: errors.news,
  }
}
