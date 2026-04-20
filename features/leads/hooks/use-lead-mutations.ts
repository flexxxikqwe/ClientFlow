"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { mutate } from "swr"
import { toast } from "sonner"
import { Lead } from "@/types/leads"
import { getStoredDemoLeads, setStoredDemoLeads } from "../utils/demo-persistence"
import { useUser } from "@/features/auth/context/user-context"

export function useLeadMutations() {
  const [isMutating, setIsMutating] = useState(false)
  const pathname = usePathname()
  const { isDemo: isUserDemo } = useUser()
  const isDemoMode = isUserDemo || pathname?.startsWith("/demo")

  const addLead = async (leadData: Partial<Lead>) => {
    setIsMutating(true)
    try {
      if (isDemoMode) {
        const currentLeads = getStoredDemoLeads()
        const newLead: Lead = {
          ...leadData,
          id: `demo-${Math.random().toString(36).substr(2, 9)}`,
          status: leadData.status || "New",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Lead
        
        const updatedLeads = [newLead, ...currentLeads]
        setStoredDemoLeads(updatedLeads)
        
        // Revalidate SWR keys for demo leads
        await mutate((key: any) => Array.isArray(key) && key[0] === "demo-leads")
        return newLead
      } else {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadData),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Failed to create lead")
        
        await mutate((key: string) => typeof key === 'string' && key.startsWith("/api/leads"))
        return data as Lead
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create lead"
      toast.error(message)
      throw error
    } finally {
      setIsMutating(false)
    }
  }

  const updateLead = async (id: string, leadData: Partial<Lead>) => {
    setIsMutating(true)
    try {
      if (isDemoMode) {
        const currentLeads = getStoredDemoLeads()
        const updatedLeads = currentLeads.map(l => 
          l.id === id ? { ...l, ...leadData, updated_at: new Date().toISOString() } : l
        )
        setStoredDemoLeads(updatedLeads)
        
        await mutate((key: any) => Array.isArray(key) && key[0] === "demo-leads")
        return updatedLeads.find(l => l.id === id)
      } else {
        const response = await fetch(`/api/leads/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadData),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Failed to update lead")
        
        await mutate((key: string) => typeof key === 'string' && key.startsWith("/api/leads"))
        return data as Lead
      }
    } catch (error) {
       const message = error instanceof Error ? error.message : "Failed to update lead"
       toast.error(message)
       throw error
    } finally {
      setIsMutating(false)
    }
  }

  const deleteLead = async (id: string) => {
    setIsMutating(true)
    try {
      if (isDemoMode) {
        const currentLeads = getStoredDemoLeads()
        const updatedLeads = currentLeads.filter(l => l.id !== id)
        setStoredDemoLeads(updatedLeads)
        
        await mutate((key: any) => Array.isArray(key) && key[0] === "demo-leads")
        return true
      } else {
        const response = await fetch(`/api/leads/${id}`, { method: "DELETE" })
        if (!response.ok) {
           const data = await response.json()
           throw new Error(data.error || "Failed to delete lead")
        }
        
        await mutate((key: string) => typeof key === 'string' && key.startsWith("/api/leads"))
        return true
      }
    } catch (error) {
       const message = error instanceof Error ? error.message : "Failed to delete lead"
       toast.error(message)
       throw error
    } finally {
      setIsMutating(false)
    }
  }

  return {
    addLead,
    updateLead,
    deleteLead,
    isMutating,
    isDemoMode
  }
}
