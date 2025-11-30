import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await DataService.getProject(params.id)

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch project",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const result = await DataService.updateProject(params.id, body)

    return NextResponse.json({
      success: true,
      data: result,
      message: "Project updated successfully",
    })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await DataService.deleteProject(params.id)

    return NextResponse.json({
      success: true,
      data: result,
      message: "Project deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete project",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
