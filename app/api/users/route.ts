import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const userType = searchParams.get("user_type")
    const isVip = searchParams.get("is_vip")
    const isActive = searchParams.get("is_active")

    // Build filters
    const filters: any = {}
    if (userType) filters.user_type = userType
    if (isVip) filters.is_vip = isVip === "true"
    if (isActive) filters.is_active = isActive === "true"

    const users = await DataService.getUsers(filters)

    // Apply limit if specified
    const limitedUsers = limit ? users.slice(0, Number.parseInt(limit)) : users

    return NextResponse.json(limitedUsers)
  } catch (error) {
    console.error("Error in GET /api/users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    if (!userData.email || !userData.full_name) {
      return NextResponse.json({ error: "Email and full name are required" }, { status: 400 })
    }

    const result = await DataService.createUser(userData)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/users:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
