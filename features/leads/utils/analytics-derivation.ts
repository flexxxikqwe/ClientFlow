import { Lead } from "@/types/leads"
import { startOfDay, subDays, format, isSameDay, parseISO } from "date-fns"

export interface AnalyticsStats {
  totalLeads: number
  wonLeads: number
  conversionRate: number
  pipelineValue: number
  newLeadsToday: number
}

export interface ChartData {
  date: string
  count: number
}

export interface SourceData {
  name: string
  value: number
}

export function deriveAnalytics(leads: Lead[]) {
  const totalLeads = leads.length
  const wonLeads = leads.filter(l => (l.status || "").toLowerCase() === "won").length
  const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0
  const pipelineValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0)
  
  const today = startOfDay(new Date())
  const newLeadsToday = leads.filter(l => {
    try {
      if (!l.created_at) return false
      return isSameDay(parseISO(l.created_at), today)
    } catch (e) {
      return false
    }
  }).length

  // Leads per day for last 30 days
  const leadsPerDay: ChartData[] = []
  for (let i = 30; i >= 0; i--) {
    const day = subDays(today, i)
    const dayStr = format(day, "yyyy-MM-dd")
    const count = leads.filter(l => {
      try {
        if (!l.created_at) return false
        return isSameDay(parseISO(l.created_at), day)
      } catch (e) {
        return false
      }
    }).length
    leadsPerDay.push({ date: dayStr, count })
  }

  // Leads by source
  const sourceMap: Record<string, number> = {}
  leads.forEach(l => {
    const source = l.source || "Other"
    sourceMap[source] = (sourceMap[source] || 0) + 1
  })
  const leadsBySource: SourceData[] = Object.entries(sourceMap).map(([name, value]) => ({
    name,
    value
  }))

  return {
    stats: {
      totalLeads,
      wonLeads,
      conversionRate: parseFloat(conversionRate.toFixed(1)),
      pipelineValue,
      newLeadsToday
    },
    leadsPerDay,
    leadsBySource
  }
}

export interface ActivityItem {
  id: string
  type: "lead_created" | "lead_won" | "stage_changed" | "note_added" | "ai_insight"
  title: string
  description: string
  timestamp: Date
  leadName: string
}

export function deriveActivity(leads: Lead[]): ActivityItem[] {
  const activities: ActivityItem[] = []

  leads.forEach(lead => {
    if (!lead) return

    // Lead Created
    activities.push({
      id: `created-${lead.id}`,
      type: "lead_created",
      title: "New Lead Captured",
      description: `Lead added to ${lead.status || 'Unknown'} stage.`,
      timestamp: lead.created_at ? parseISO(lead.created_at) : new Date(),
      leadName: `${lead.first_name || 'Prospect'} ${lead.last_name || ''}`.trim()
    })

    // Lead Won
    if (lead.status && lead.status.toLowerCase() === "won") {
      activities.push({
        id: `won-${lead.id}`,
        type: "lead_won",
        title: "Deal Closed",
        description: "Successfully converted to a paying customer.",
        timestamp: lead.updated_at ? parseISO(lead.updated_at) : new Date(),
        leadName: `${lead.first_name || 'Prospect'} ${lead.last_name || ''}`.trim()
      })
    }

    // Notes
    if (Array.isArray(lead.notes)) {
      lead.notes.forEach(note => {
        if (!note) return
        const content = note.content || ""
        activities.push({
          id: `note-${note.id}`,
          type: "note_added",
          title: "Note Added",
          description: content.length > 60 ? content.substring(0, 57) + "..." : content,
          timestamp: note.created_at ? parseISO(note.created_at) : new Date(),
          leadName: `${lead.first_name || 'Prospect'} ${lead.last_name || ''}`.trim()
        })
      })
    }
  })

  // Sort by timestamp desc and take top 5
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5)
}
