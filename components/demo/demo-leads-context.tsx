"use client"

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react"
import { mutate } from "swr"
import { Lead } from "@/types/leads"
import { DEMO_LEADS } from "@/lib/demo-data"
import { getStoredDemoLeads, setStoredDemoLeads } from "@/features/leads/utils/demo-persistence"

interface DemoLeadsContextType {
  leads: Lead[]
  isInitialized: boolean
  addLead: (lead: Omit<Lead, "id" | "created_at" | "updated_at" | "notes" | "ai_insights">) => void
  updateLead: (id: string, updates: Partial<Lead>) => void
  updateLeadStatus: (leadId: string, newStatus: string) => void
  deleteLeads: (leadIds: string[]) => void
  selectedIds: string[]
  setSelectedIds: (ids: string[]) => void
  toggleSelectLead: (id: string) => void
  addNote: (leadId: string, content: string) => void
}

const DemoLeadsContext = createContext<DemoLeadsContextType | undefined>(undefined)

export function DemoLeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getStoredDemoLeads()
    setTimeout(() => {
      setLeads(stored)
      setIsInitialized(true)
    }, 0)
  }, [])

  // Persist to localStorage whenever leads change
  useEffect(() => {
    if (isInitialized) {
      setStoredDemoLeads(leads)
      // Trigger SWR revalidation for any hook using 'demo-leads'
      mutate((key: any) => Array.isArray(key) && key[0] === "demo-leads")
    }
  }, [leads, isInitialized])

  const addLead = useCallback((newLeadData: Omit<Lead, "id" | "created_at" | "updated_at" | "notes" | "ai_insights">) => {
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

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, ...updates, updated_at: new Date().toISOString() } : lead
    ))
  }, [])

  const updateLeadStatus = useCallback((leadId: string, newStatus: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus, updated_at: new Date().toISOString() } : lead
    ))
  }, [])

  const deleteLeads = useCallback((leadIds: string[]) => {
    setLeads(prev => prev.filter(lead => !leadIds.includes(lead.id)))
    setSelectedIds(prev => prev.filter(id => !leadIds.includes(id)))
  }, [])

  const addNote = useCallback((leadId: string, content: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newNote = {
          id: `note-${Date.now()}`,
          content,
          created_at: new Date().toISOString(),
          author: { full_name: "Demo User" }
        }
        return {
          ...lead,
          notes: [...(lead.notes || []), newNote as any],
          updated_at: new Date().toISOString()
        }
      }
      return lead
    }))
  }, [])

  const toggleSelectLead = useCallback((id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [])

  const value = useMemo(() => ({
    leads,
    isInitialized,
    addLead,
    updateLead,
    updateLeadStatus,
    deleteLeads,
    selectedIds,
    setSelectedIds,
    toggleSelectLead,
    addNote
  }), [leads, isInitialized, addLead, updateLead, updateLeadStatus, deleteLeads, selectedIds, toggleSelectLead, addNote])

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
