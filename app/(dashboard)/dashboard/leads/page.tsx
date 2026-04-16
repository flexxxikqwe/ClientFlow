"use client"

import { useState, useMemo, useCallback, memo, useEffect } from "react"
import { Users, Plus, BarChart3, TrendingUp, Clock, Loader2, LayoutGrid, Table as TableIcon } from "lucide-react"
import { format } from "date-fns"
import useSWR, { mutate } from "swr"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

import { LeadsTable } from "@/components/leads/leads-table"
import { LeadKanban } from "@/components/leads/lead-kanban"
import { LeadDetails } from "@/components/leads/lead-details"
import { CreateLeadModal } from "@/components/leads/create-lead-modal"
import { BulkActionToolbar } from "@/components/leads/bulk-action-toolbar"
import { safeJson } from "@/lib/utils/safe-json"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Lead } from "@/types/leads"
import { toast } from "sonner"

import { useUser } from "@/features/auth/context/user-context"
import { useLeads } from "@/features/leads/hooks/use-leads"
import { fetcher } from "@/lib/utils/fetcher"
import { cn } from "@/lib/utils"
import { convertToCSV, downloadCSV, LEAD_CSV_HEADERS } from "@/lib/utils/csv"

export default function LeadsPage() {
  const { isDemo } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [viewMode, setViewMode] = useState<"table" | "kanban">((searchParams.get("view") as "table" | "kanban") || "table")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Filter state initialized from URL
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1)
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">((searchParams.get("sortOrder") as "asc" | "desc") || "desc")

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const { mutate: mutateLeads } = useLeads({
    page,
    search,
    status,
    sortBy,
    sortOrder,
  })

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [])

  const handleSelectAll = useCallback((ids: string[]) => {
    setSelectedIds(ids)
  }, [])

  const handleBulkDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/leads?ids=${selectedIds.join(",")}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await safeJson(response)
        throw new Error(data?.error || "Failed to delete leads")
      }

      toast.success(`${selectedIds.length} leads deleted successfully`)
      setSelectedIds([])
      mutateLeads()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete leads"
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }, [selectedIds, mutateLeads])

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (viewMode !== "table") params.set("view", viewMode)
    else params.delete("view")

    if (search) params.set("search", search)
    else params.delete("search")
    
    if (status !== "all") params.set("status", status)
    else params.delete("status")
    
    if (page > 1) params.set("page", page.toString())
    else params.delete("page")
    
    if (sortBy !== "created_at") params.set("sortBy", sortBy)
    else params.delete("sortBy")
    
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder)
    else params.delete("sortOrder")

    const query = params.toString()
    const url = `${pathname}${query ? `?${query}` : ""}`
    
    // Use replace to avoid history bloat
    router.replace(url, { scroll: false })
  }, [viewMode, search, status, page, sortBy, sortOrder, pathname, router, searchParams])

  const { data: analytics, mutate: mutateAnalytics, isLoading: isAnalyticsLoading } = useSWR("/api/analytics", fetcher)

  const { data: allLeadsData, mutate: mutateAllLeads } = useSWR(
    viewMode === "kanban" ? "/api/leads?limit=1000" : null,
    fetcher
  )

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      toast.success("Lead status updated")
      mutateAllLeads()
      mutateAnalytics()
    } catch (error) {
      toast.error("Failed to update lead status")
    }
  }

  const handleLeadClick = useCallback((lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailsOpen(true)
  }, [])

  const handleUpdate = useCallback(() => {
    mutateLeads()
    mutateAnalytics()
  }, [mutateLeads, mutateAnalytics])

  const handleExport = async () => {
    setIsExporting(true)
    toast.info("Preparing leads export...")
    
    try {
      const queryParams = new URLSearchParams({
        limit: "1000", // Fetch a large batch for export
        search: search,
        status: status,
        sortBy: sortBy,
        sortOrder: sortOrder,
      })
      
      const response = await fetch(`/api/leads?${queryParams.toString()}`)
      const data = await response.json()
      
      const leadsToExport = data.leads || []
      
      if (leadsToExport.length === 0) {
        toast.error("No leads found to export")
        return
      }

      const csvContent = convertToCSV(leadsToExport, LEAD_CSV_HEADERS)
      const date = format(new Date(), "yyyy-MM-dd-HHmm")
      downloadCSV(csvContent, `clientflow-leads-export-${date}.csv`)
      
      toast.success(`Successfully exported ${leadsToExport.length} leads`)
    } catch (error) {
      console.error("Export error:", error)
      toast.error("Failed to export leads")
    } finally {
      setIsExporting(false)
    }
  }

  const stats = useMemo(() => [
    {
      title: "Total Leads",
      value: analytics?.stats?.totalLeads?.toLocaleString() || 0,
      icon: Users,
      description: "Last 30 days",
      color: "text-primary"
    },
    {
      title: "Pipeline Value",
      value: `$${analytics?.stats?.pipelineValue?.toLocaleString() || 0}`,
      icon: BarChart3,
      description: "Total value",
      color: "text-primary"
    },
    {
      title: "Conversion Rate",
      value: `${analytics?.stats?.conversionRate || 0}%`,
      icon: TrendingUp,
      description: "Won / Total",
      color: "text-primary"
    },
    {
      title: "Active Leads",
      value: (analytics?.stats?.totalLeads || 0) - (analytics?.stats?.wonLeads || 0),
      icon: Clock,
      description: "Excluding Won",
      color: "text-primary"
    }
  ], [analytics])

  return (
    <div className="p-12 space-y-16 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Leads Management</h1>
          <p className="text-sm font-medium text-muted-foreground/80">Track, manage and convert your sales opportunities with ease.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
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
              "Export CSV"
            )}
          </Button>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 mr-2" /> New Lead
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card/30 backdrop-blur-sm shadow-none rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:bg-card/50 group">
            <CardHeader className="flex flex-row items-center justify-between pb-6 space-y-0">
              <CardTitle className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">{stat.title}</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                <stat.icon className={cn("h-4 w-4 transition-colors", stat.color, "group-hover:text-primary")} />
              </div>
            </CardHeader>
            <CardContent>
              {isAnalyticsLoading ? (
                <Skeleton className="h-10 w-24 mt-1 bg-secondary/20" />
              ) : (
                <div className="text-4xl font-semibold tracking-tight text-foreground mt-1">{stat.value}</div>
              )}
              <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mt-4">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Active Pipeline</h2>
          </div>
          <div className="h-px flex-1 bg-border/30 mx-12 hidden md:block" />
          <div className="flex items-center bg-secondary/20 p-1 rounded-xl border border-border/50">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={cn(
                "rounded-lg px-4 h-9 font-bold text-[10px] uppercase tracking-widest transition-all",
                viewMode === "table" ? "bg-background shadow-sm text-primary" : "text-muted-foreground/60 hover:text-foreground"
              )}
            >
              <TableIcon className="h-3.5 w-3.5 mr-2" />
              Table
            </Button>
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className={cn(
                "rounded-lg px-4 h-9 font-bold text-[10px] uppercase tracking-widest transition-all",
                viewMode === "kanban" ? "bg-background shadow-sm text-primary" : "text-muted-foreground/60 hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5 mr-2" />
              Kanban
            </Button>
          </div>
        </div>
        
        {viewMode === "table" ? (
          <LeadsTable 
            onLeadClick={handleLeadClick}
            page={page}
            setPage={setPage}
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
          />
        ) : (
          <LeadKanban 
            leads={allLeadsData?.leads || []}
            onLeadClick={handleLeadClick}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <LeadDetails 
        lead={selectedLead} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        onUpdate={handleUpdate}
      />

      <CreateLeadModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={handleUpdate}
      />

      <BulkActionToolbar 
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onDelete={handleBulkDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
