import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      propertyType: searchParams.get("propertyType") || undefined,
      minPrice: searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice")!) : undefined,
      bedrooms: searchParams.get("bedrooms")?.split(",").map(Number) || undefined,
      bathrooms: searchParams.get("bathrooms")?.split(",").map(Number) || undefined,
      minArea: searchParams.get("minArea") ? Number.parseInt(searchParams.get("minArea")!) : undefined,
      maxArea: searchParams.get("maxArea") ? Number.parseInt(searchParams.get("maxArea")!) : undefined,
      district: searchParams.get("district") || undefined,
      city: searchParams.get("city") || undefined,
      direction: searchParams.get("direction")?.split(",") || undefined,
      legal: searchParams.get("legal")?.split(",") || undefined,
      search: searchParams.get("search") || undefined,
    }

    const properties = await DataService.getRentalProperties(filters)

    return NextResponse.json({
      success: true,
      data: properties,
      count: properties.length,
      type: "rental",
    })
  } catch (error) {
    console.error("Rental properties API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch rental properties" }, { status: 500 })
  }
}
