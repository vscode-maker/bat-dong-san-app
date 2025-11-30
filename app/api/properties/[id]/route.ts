import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const property = await DataService.getProperty(params.id)

    if (!property) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: property,
    })
  } catch (error) {
    console.error("Property API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch property" }, { status: 500 })
  }
}
