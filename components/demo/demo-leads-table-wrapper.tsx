"use client"

import { useState, useCallback, useMemo } from "react"
import { Plus, Download, Loader2 } from "lucide-react"
import { DemoLeadsTable } from "@/components/demo/demo-leads-table"
import { Button } from "@/components/ui/button"
import { Lead } from "@/types/leads"
import { toast } from "sonner"
import { LeadDetails } from "@/components/leads/lead-details"
import { CreateLeadModal } from "@/components/leads/create-lead-modal"
import { useDemoLeads } from "@/components/demo/demo-leads-context"
import { convertToCSV, downloadCSV, LEAD_CSV_HEADERS } from "@/lib/utils/csv"

interface DemoLeadsTableWrapperProps {
  isTableOnly?: boolean
}

export function DemoLeadsTableWrapper({ isTableOnly = false }: DemoLeadsTableWrapperProps) {
  const demoLeads = useDemoLeads()
  const leads = useMemo(() => demoLeads?.leads || [], [demoLeads])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Filter state moved from DemoLeadsTable to support export
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")

  const handleLeadClick = useCallback((lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailsOpen(true)
  }, [])

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        search === "" ||
        lead.first_name.toLowerCase().includes(search.toLowerCase()) ||
        lead.last_name.toLowerCase().includes(search.toLowerCase()) ||
        (lead.email && lead.email.toLowerCase().includes(search.toLowerCase())) ||
        (lead.company && lead.company.toLowerCase().includes(search.toLowerCase()))
      
      const matchesStatus = status === "all" || lead.status.toLowerCase() === status.toLowerCase()
      
      return matchesSearch && matchesStatus
    })
  }, [leads, search, status])

  const handleExport = async () => {
    setIsExporting(true)
    toast.info("Showcase Mode: Preparing demo leads export...")
    
    try {
      // Small delay to simulate processing for better UX feel
      await new Promise(resolve => setTimeout(resolve, 800))
      
      if (filteredLeads.length === 0) {
        toast.error("No matching leads found to export")
        return
      }

      const csvContent = convertToCSV(filteredLeads, LEAD_CSV_HEADERS)
      const date = new Date().toISOString().split('T')[0]
      downloadCSV(csvContent, `clientflow-demo-leads-${date}.csv`)
      
      toast.success(`Successfully exported ${filteredLeads.length} demo leads`)
    } catch (error) {
      toast.error("Failed to export demo leads")
    } finally {
      setIsExporting(false)
    }
  }

  if (isTableOnly) {
    return (
      <>
        <DemoLeadsTable 
          leads={leads}
          onLeadClick={handleLeadClick} 
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />
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
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </>
        )}
      </Button>
      <Button 
        onClick={() => setIsCreateModalOpen(true)}
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

      <CreateLeadModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {}}
      />
    </>
  )
}
