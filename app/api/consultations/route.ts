import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["full_name", "phone", "email", "message"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const consultation = await DataService.requestConsultation(body)

    return NextResponse.json({
      success: true,
      data: consultation,
      message: "Consultation request submitted successfully",
    })
  } catch (error) {
    console.error("Consultation API error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit consultation request" }, { status: 500 })
  }
}
