"use client"

import { useState, useCallback } from "react"
import { Plus, Download } from "lucide-react"
import { DemoLeadsTable } from "@/components/demo/demo-leads-table"
import { Button } from "@/components/ui/button"
import { Lead } from "@/types/leads"
import { toast } from "sonner"
import { LeadDetails } from "@/components/leads/lead-details"

interface DemoLeadsTableWrapperProps {
  isTableOnly?: boolean
}

export function DemoLeadsTableWrapper({ isTableOnly = false }: DemoLeadsTableWrapperProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleLeadClick = useCallback((lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailsOpen(true)
  }, [])

  if (isTableOnly) {
    return (
      <>
        <DemoLeadsTable onLeadClick={handleLeadClick} />
        <LeadDetails 
          lead={selectedLead} 
          isOpen={isDetailsOpen} 
          onClose={() => setIsDetailsOpen(false)} 
          onUpdate={() => {}} 
        />
      </>
    )
  }

  return (
    <>
      <Button 
        variant="outline" 
        className="flex-1 md:flex-none h-11 px-6 rounded-xl shadow-none border-border/50 font-bold text-[10px] uppercase tracking-[0.2em] bg-background/50 backdrop-blur-sm transition-all hover:bg-secondary/20" 
        onClick={() => toast.info("Showcase Mode: Data export is simulated.")}
      >
        <Download className="h-4 w-4 mr-2" /> Export CSV
      </Button>
      <Button 
        onClick={() => toast.info("Showcase Mode: Lead creation is disabled in this preview.")}
        className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="h-4 w-4 mr-2" /> New Lead
      </Button>
      
      <LeadDetails 
        lead={selectedLead} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        onUpdate={() => {}} 
      />
    </>
  )
}
