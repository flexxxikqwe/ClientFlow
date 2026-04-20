"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Plus, Download, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { DemoLeadsTable } from "@/components/demo/demo-leads-table"
import { LeadKanban } from "@/components/leads/lead-kanban"
import { Button } from "@/components/ui/button"
import { Lead } from "@/types/leads"
import { toast } from "sonner"
import { LeadDetails } from "@/components/leads/lead-details"
import { CreateLeadModal } from "@/components/leads/create-lead-modal"
import { useDemoLeads } from "@/components/demo/demo-leads-context"
import { convertToCSV, downloadCSV, LEAD_CSV_HEADERS } from "@/lib/utils/csv"
import { BulkActionToolbar } from "@/components/leads/bulk-action-toolbar"

interface DemoLeadsTableWrapperProps {
  isTableOnly?: boolean
  viewMode?: "table" | "kanban"
}

export function DemoLeadsTableWrapper({ isTableOnly = false, viewMode = "table" }: DemoLeadsTableWrapperProps) {
  const demoLeads = useDemoLeads()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const leads = useMemo(() => demoLeads?.leads || [], [demoLeads])
  const updateLeadStatus = demoLeads?.updateLeadStatus
  const deleteLeads = demoLeads?.deleteLeads
  const selectedIds = useMemo(() => demoLeads?.selectedIds || [], [demoLeads?.selectedIds])
  const setSelectedIds = demoLeads?.setSelectedIds
  const toggleSelectLead = demoLeads?.toggleSelectLead
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
// ... existing state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Filter state initialized from URL
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "all")

  const [isDeleting, setIsDeleting] = useState(false)

  const handleBulkDelete = useCallback(async () => {
    if (!deleteLeads || !setSelectedIds) return
    
    setIsDeleting(true)
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))
      deleteLeads(selectedIds)
      setSelectedIds([])
      toast.success(`${selectedIds.length} leads deleted successfully`)
    } catch (error) {
      toast.error("Failed to delete leads")
    } finally {
      setIsDeleting(false)
    }
  }, [selectedIds, deleteLeads, setSelectedIds])

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (search) params.set("search", search)
    else params.delete("search")
    
    if (status !== "all") params.set("status", status)
    else params.delete("status")

    const query = params.toString()
    const url = `${pathname}${query ? `?${query}` : ""}`
    
    router.replace(url, { scroll: false })
  }, [search, status, pathname, router, searchParams])

  const handleLeadClick = useCallback((lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailsOpen(true)
  }, [])

  const selectedNames = useMemo(() => {
    return leads
      .filter(l => selectedIds.includes(l.id))
      .map(l => `${l.first_name} ${l.last_name}`)
  }, [leads, selectedIds])

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
      const date = format(new Date(), "yyyy-MM-dd-HHmm")
      downloadCSV(csvContent, `clientflow-demo-export-${date}.csv`)
      
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
        {viewMode === "table" ? (
          <DemoLeadsTable 
            leads={leads}
            onLeadClick={handleLeadClick} 
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelectLead || (() => {})}
            onSelectAll={setSelectedIds || (() => {})}
          />
        ) : (
          <LeadKanban 
            leads={filteredLeads} 
            onLeadClick={handleLeadClick}
            onStatusChange={updateLeadStatus}
          />
        )}
        <LeadDetails 
          lead={selectedLead} 
          isOpen={isDetailsOpen} 
          onClose={() => setIsDetailsOpen(false)} 
          onUpdate={() => {}} 
        />
        <BulkActionToolbar 
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds?.([])}
          onDelete={handleBulkDelete}
          selectedNames={selectedNames}
          isDeleting={isDeleting}
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

      <BulkActionToolbar 
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds?.([])}
        onDelete={handleBulkDelete}
        selectedNames={selectedNames}
        isDeleting={isDeleting}
      />
    </>
  )
}
