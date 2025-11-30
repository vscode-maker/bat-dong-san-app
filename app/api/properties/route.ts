import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      propertyType: searchParams.get("propertyType") || undefined,
      transactionType: searchParams.get("transactionType") || undefined,
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

    let properties
    if (filters.transactionType === "rent") {
      properties = await DataService.getRentalProperties(filters)
    } else if (filters.transactionType === "sale") {
      properties = await DataService.getSaleProperties(filters)
    } else {
      properties = await DataService.getProperties(filters)
    }

    return NextResponse.json({
      success: true,
      data: properties,
      count: properties.length,
    })
  } catch (error) {
    console.error("Properties API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["title", "price", "property_type", "transaction_type", "address"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const property = await DataService.createProperty(body)

    return NextResponse.json({
      success: true,
      data: property,
    })
  } catch (error) {
    console.error("Create property API error:", error)
    return NextResponse.json({ success: false, error: "Failed to create property" }, { status: 500 })
  }
}
