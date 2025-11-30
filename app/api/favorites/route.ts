import { type NextRequest, NextResponse } from "next/server"

// Mock favorites data for testing
const mockFavorites = [
  {
    id: "fav1",
    property_id: "1",
    user_id: "456",
    created_at: new Date().toISOString(),
  },
  {
    id: "fav2",
    property_id: "3",
    user_id: "456",
    created_at: new Date().toISOString(),
  },
  {
    id: "fav3",
    property_id: "5",
    user_id: "456",
    created_at: new Date().toISOString(),
  },
  {
    id: "fav4",
    property_id: "7",
    user_id: "456",
    created_at: new Date().toISOString(),
  },
  // Other users
  {
    id: "fav5",
    property_id: "2",
    user_id: "123",
    created_at: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID is required",
      })
    }

    console.log(`📋 Fetching favorites for user: ${userId}`)

    // Filter favorites for this user
    const userFavorites = mockFavorites.filter((fav) => fav.user_id === userId)

    console.log(`✅ Found ${userFavorites.length} favorites for user: ${userId}`)

    return NextResponse.json({
      success: true,
      data: userFavorites,
    })
  } catch (error) {
    console.error("❌ Error fetching favorites:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch favorites",
    })
  }
}
