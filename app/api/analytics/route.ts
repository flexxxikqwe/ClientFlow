import { NextResponse } from "next/server"
import { analyticsRepository } from "@/lib/db"
import { getSessionUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get("days") || "30")
    
    const user = await getSessionUser()
    if (!user) {
      console.warn("Analytics API: Unauthorized access attempt")
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const analytics = await analyticsRepository.getAnalytics(days)

    if (!analytics) {
      throw new Error("Analytics repository returned null")
    }

    return NextResponse.json(analytics)
  } catch (error: any) {
    console.error("Analytics API Error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch analytics",
      details: error?.message || "Unknown error"
    }, { status: 500 })
  }
}
