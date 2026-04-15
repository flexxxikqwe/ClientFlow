"use client"

import React, { createContext, useContext, useState, useCallback, useMemo } from "react"
import { Lead } from "@/types/leads"
import { DEMO_LEADS } from "@/lib/demo-data"

interface DemoLeadsContextType {
  leads: Lead[]
  addLead: (lead: Omit<Lead, "id" | "created_at" | "updated_at" | "notes" | "ai_insights">) => void
  updateLeadStatus: (leadId: string, newStatus: string) => void
}

const DemoLeadsContext = createContext<DemoLeadsContextType | undefined>(undefined)

export function DemoLeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS as Lead[])

  const addLead = useCallback((newLeadData: Omit<Lead, "id" | "created_at" | "updated_at" | "notes" | "ai_insights">) => {
    // ... existing addLead logic
    const lead: Lead = {
      ...newLeadData,
      id: `demo-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: [],
      ai_insights: {
        summary: {
          summary: "New demo lead created during session. AI insights will be generated after more activity.",
          keyPoints: ["Newly created lead", "Awaiting initial contact"]
        },
        classification: {
          priority: "warm",
          reasoning: "Lead was manually added during the demo session."
        },
        reply: {
          subject: `Welcome to ClientFlow, ${newLeadData.first_name}!`,
          body: `Hi ${newLeadData.first_name},\n\nThanks for your interest in ClientFlow. I'd love to schedule a quick call to learn more about ${newLeadData.company || "your business"} and see how we can help.\n\nBest,\nAlex`
        }
      }
    } as Lead

    setLeads(prev => [lead, ...prev])
  }, [])

  const updateLeadStatus = useCallback((leadId: string, newStatus: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus, updated_at: new Date().toISOString() } : lead
    ))
  }, [])

  const value = useMemo(() => ({
    leads,
    addLead,
    updateLeadStatus
  }), [leads, addLead, updateLeadStatus])

  return (
    <DemoLeadsContext.Provider value={value}>
      {children}
    </DemoLeadsContext.Provider>
  )
}

export function useDemoLeads() {
  const context = useContext(DemoLeadsContext)
  return context || null
}
