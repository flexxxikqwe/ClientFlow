"use client"

import { useState, useCallback } from "react"
import { Plus } from "lucide-react"
import { DemoLeadsTable } from "@/components/demo/demo-leads-table"
import { Button } from "@/components/ui/button"
import { Lead } from "@/types/leads"
import { toast } from "sonner"

interface DemoLeadsTableWrapperProps {
  isTableOnly?: boolean
}

export function DemoLeadsTableWrapper({ isTableOnly = false }: DemoLeadsTableWrapperProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const handleLeadClick = useCallback((lead: Lead) => {
    setSelectedLead(lead)
    toast.info("Showcase Mode: Detailed lead profiles are available in the full version.")
  }, [])

  if (isTableOnly) {
    return <DemoLeadsTable onLeadClick={handleLeadClick} />
  }

  return (
    <>
      <Button 
        variant="outline" 
        className="flex-1 md:flex-none h-11 px-6 rounded-xl shadow-none border-border/50 font-bold text-[10px] uppercase tracking-[0.2em] bg-background/50 backdrop-blur-sm transition-all hover:bg-secondary/20" 
        onClick={() => toast.info("Showcase Mode: Data export is simulated.")}
      >
        Export CSV
      </Button>
      <Button 
        onClick={() => toast.info("Showcase Mode: Lead creation is disabled in this preview.")}
        className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="h-4 w-4 mr-2" /> New Lead
      </Button>
    </>
  )
}
