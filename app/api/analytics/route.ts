import { NextResponse } from "next/server"
import { getLeads } from "@/lib/db"
import { getSessionUser } from "@/lib/auth"
import { startOfDay, endOfDay, subDays, format, eachDayOfInterval } from "date-fns"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get("days") || "30")
    
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const startDate = startOfDay(subDays(new Date(), days - 1))
    const endDate = endOfDay(new Date())

    // Get all leads and filter by date
    const { data: allLeads } = getLeads({ limit: 1000000 }) // Get all leads
    const leads = allLeads.filter(l => {
      const createdAt = new Date(l.created_at)
      return createdAt >= startDate && createdAt <= endDate
    })

    const daysInterval = eachDayOfInterval({
      start: startDate,
      end: endDate,
    })

    const leadsPerDay = daysInterval.map((day) => {
      const dayStr = format(day, "MMM dd")
      const count = leads.filter((l) => 
        format(new Date(l.created_at), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
      ).length
      return { date: dayStr, count }
    })

    const sourceCounts: Record<string, number> = {}
    leads.forEach((l) => {
      const source = l.source || "Unknown"
      sourceCounts[source] = (sourceCounts[source] || 0) + 1
    })
    const leadsBySource = Object.entries(sourceCounts).map(([name, value]) => ({
      name,
      value,
    }))

    const total = leads.length
    const won = leads.filter((l) => l.status === "won" || l.status === "Closed Won").length
    const conversionRate = total > 0 ? (won / total) * 100 : 0
    
    const pipelineValue = leads.reduce((acc, l) => acc + (l.value || 0), 0)

    return NextResponse.json({
      leadsPerDay,
      leadsBySource,
      stats: {
        totalLeads: total,
        wonLeads: won,
        conversionRate: conversionRate.toFixed(1),
        pipelineValue,
      },
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
