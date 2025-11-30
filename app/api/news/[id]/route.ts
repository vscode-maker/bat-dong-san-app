import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const article = await DataService.getNewsArticle(params.id)

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: "News article not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: article,
    })
  } catch (error) {
    console.error("Error fetching news article:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch news article",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const result = await DataService.updateNews(params.id, body)

    return NextResponse.json({
      success: true,
      data: result,
      message: "News article updated successfully",
    })
  } catch (error) {
    console.error("Error updating news article:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update news article",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await DataService.deleteNews(params.id)

    return NextResponse.json({
      success: true,
      data: result,
      message: "News article deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting news article:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete news article",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
