import { type NextRequest, NextResponse } from "next/server"

// Mock storage (in real app, this would be database)
const mockFavorites = [
  {
    id: "1",
    property_id: "1",
    user_id: "user123",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    property_id: "3",
    user_id: "user123",
    created_at: new Date().toISOString(),
  },
]

export async function POST(request: NextRequest) {
  try {
    const { userId, propertyId } = await request.json()

    if (!userId || !propertyId) {
      return NextResponse.json({
        success: false,
        error: "User ID and Property ID are required",
      })
    }

    console.log(`🔄 Toggling favorite for user: ${userId}, property: ${propertyId}`)

    // Check if already favorited
    const existingIndex = mockFavorites.findIndex((fav) => fav.user_id === userId && fav.property_id === propertyId)

    if (existingIndex >= 0) {
      // Remove from favorites
      mockFavorites.splice(existingIndex, 1)
      console.log(`❌ Removed favorite: ${propertyId}`)

      return NextResponse.json({
        success: true,
        data: {
          action: "removed",
          message: "Đã bỏ yêu thích",
        },
      })
    } else {
      // Add to favorites
      const newFavorite = {
        id: Date.now().toString(),
        property_id: propertyId,
        user_id: userId,
        created_at: new Date().toISOString(),
      }
      mockFavorites.push(newFavorite)
      console.log(`✅ Added favorite: ${propertyId}`)

      return NextResponse.json({
        success: true,
        data: {
          action: "added",
          message: "Đã thêm vào yêu thích",
        },
      })
    }
  } catch (error) {
    console.error("❌ Error toggling favorite:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to toggle favorite",
    })
  }
}
