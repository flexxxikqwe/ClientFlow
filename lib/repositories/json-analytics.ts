import { IAnalyticsRepository } from './interfaces';
import { startOfDay, endOfDay, subDays, format, eachDayOfInterval } from "date-fns"
import { getDb } from '@/lib/json-db';

export class JsonAnalyticsRepository implements IAnalyticsRepository {
  async getAnalytics(days: number) {
    const startDate = startOfDay(subDays(new Date(), days - 1))
    const endDate = endOfDay(new Date())

    const data = getDb();
    const leads = data.leads.filter(l => {
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
    const won = leads.filter((l) => {
      const s = l.status?.toLowerCase()
      return s === "won" || s === "closed won"
    }).length
    const conversionRate = total > 0 ? (won / total) * 100 : 0
    
    const pipelineValue = leads.reduce((acc, l) => acc + (Number(l.value) || 0), 0)

    return {
      leadsPerDay,
      leadsBySource,
      stats: {
        totalLeads: total,
        wonLeads: won,
        conversionRate: conversionRate.toFixed(1),
        pipelineValue,
      },
    }
  }
}
