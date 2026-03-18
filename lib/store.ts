import { Lead } from "@/types/leads"
import { MOCK_LEADS, MOCK_STAGES, DEMO_USER } from "./mock-data"
import { v4 as uuidv4 } from "uuid"

const LEADS_KEY = "clientflow_leads"
const USER_KEY = "clientflow_user"

export class LocalStore {
  static getLeads(): Lead[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(LEADS_KEY)
    if (!stored) {
      this.saveLeads(MOCK_LEADS)
      return MOCK_LEADS
    }
    return JSON.parse(stored)
  }

  static saveLeads(leads: Lead[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
  }

  static addLead(lead: Omit<Lead, "id" | "created_at" | "updated_at">): Lead {
    const leads = this.getLeads()
    const newLead: Lead = {
      ...lead,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: []
    }
    this.saveLeads([newLead, ...leads])
    return newLead
  }

  static updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const leads = this.getLeads()
    const index = leads.findIndex(l => l.id === id)
    if (index === -1) return null
    
    const updatedLead = {
      ...leads[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    leads[index] = updatedLead
    this.saveLeads([...leads])
    return updatedLead
  }

  static deleteLead(id: string) {
    const leads = this.getLeads()
    this.saveLeads(leads.filter(l => l.id !== id))
  }

  static getLead(id: string): Lead | null {
    return this.getLeads().find(l => l.id === id) || null
  }

  static getStages() {
    return MOCK_STAGES
  }

  static getAnalytics() {
    const leads = this.getLeads()
    const totalLeads = leads.length
    const wonLeads = leads.filter(l => l.status === "won").length
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0
    const pipelineValue = leads.reduce((sum, l) => sum + (l.value || 0), 0)

    // Group by source
    const sourceMap: Record<string, number> = {}
    leads.forEach(l => {
      const s = l.source || "Other"
      sourceMap[s] = (sourceMap[s] || 0) + 1
    })
    const leadsBySource = Object.entries(sourceMap).map(([source, count]) => ({ source, count }))

    // Group by day (last 30 days)
    const dayMap: Record<string, number> = {}
    const now = new Date()
    for (let i = 0; i < 30; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      dayMap[d.toISOString().split('T')[0]] = 0
    }
    leads.forEach(l => {
      const date = l.created_at.split('T')[0]
      if (dayMap[date] !== undefined) {
        dayMap[date]++
      }
    })
    const leadsPerDay = Object.entries(dayMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return {
      stats: {
        totalLeads,
        wonLeads,
        conversionRate,
        pipelineValue
      },
      leadsPerDay,
      leadsBySource
    }
  }

  static getUser() {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  }

  static setUser(user: any) {
    if (typeof window === "undefined") return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  static clearUser() {
    if (typeof window === "undefined") return
    localStorage.removeItem(USER_KEY)
  }
}
