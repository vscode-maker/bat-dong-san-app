import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const category = searchParams.get("category")

    let news
    if (category) {
      news = await DataService.getNewsByCategory(category, limit ? Number.parseInt(limit) : undefined)
    } else {
      news = await DataService.getNews(limit ? Number.parseInt(limit) : undefined)
    }

    return NextResponse.json({
      success: true,
      data: news,
      total: news.length,
    })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch news",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = await DataService.createNews(body)

    return NextResponse.json({
      success: true,
      data: result,
      message: "News article created successfully",
    })
  } catch (error) {
    console.error("Error creating news:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create news article",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
