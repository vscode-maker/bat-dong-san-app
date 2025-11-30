import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const filters = {
      project_type: searchParams.get("project_type") || undefined,
      status: searchParams.get("status") || undefined,
      developer: searchParams.get("developer") || undefined,
      district: searchParams.get("district") || undefined,
      city: searchParams.get("city") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      search: searchParams.get("search") || undefined,
      featured: searchParams.get("featured") === "true" ? true : undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    }

    // Remove undefined values
    const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== undefined))

    const projects = await DataService.getProjects(cleanFilters)

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = await DataService.createProject(body)

    return NextResponse.json({
      success: true,
      data: result,
      message: "Project created successfully",
    })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
