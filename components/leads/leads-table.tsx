"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  UserPlus,
  Mail,
  Phone,
  Building2,
  Loader2
} from "lucide-react"
import { format } from "date-fns"
import { useLeads } from "@/features/leads/hooks/use-leads"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { LeadStatusBadge } from "./lead-status-badge"
import { cn } from "@/lib/utils"
import { Lead } from "@/types/leads"
import { toast } from "sonner"
import { useUser } from "@/features/auth/context/user-context"
import { MOCK_LEADS } from "@/lib/mock-data"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"

interface LeadsTableProps {
  onLeadClick: (lead: Lead) => void
}

const LeadRow = memo(({ lead, onLeadClick, onDelete }: { 
  lead: Lead, 
  onLeadClick: (lead: Lead) => void,
  onDelete: (id: string, e: React.MouseEvent) => void
}) => (
  <TableRow 
    className="group cursor-pointer hover:bg-secondary/15 transition-all duration-200 border-b border-border/20"
    onClick={() => onLeadClick(lead)}
  >
    <TableCell className="py-5 pl-8">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
          {lead.first_name[0]}{lead.last_name[0]}
        </div>
        <div className="font-semibold text-foreground text-sm tracking-tight">
          {lead.first_name} {lead.last_name}
        </div>
      </div>
    </TableCell>
    <TableCell>
      <div className="text-sm text-muted-foreground/80 font-medium">{lead.email || "-"}</div>
    </TableCell>
    <TableCell>
      <div className="text-sm text-muted-foreground/80 font-medium">{lead.phone || "-"}</div>
    </TableCell>
    <TableCell>
      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">{lead.source || "Direct"}</div>
    </TableCell>
    <TableCell>
      <LeadStatusBadge status={lead.status} />
    </TableCell>
    <TableCell className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-[0.15em]">
      {format(new Date(lead.created_at), "MMM d, yyyy")}
    </TableCell>
    <TableCell className="pr-8" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-secondary/50 rounded-lg">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground/40" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-1.5 backdrop-blur-xl bg-card/95 border-border/50 rounded-xl shadow-2xl">
          <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 px-2.5 py-2">Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onLeadClick(lead)} className="rounded-lg cursor-pointer py-2 px-2.5 text-sm font-medium">
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border/30 my-1" />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer py-2 px-2.5 text-sm font-medium"
            onClick={(e) => onDelete(lead.id, e)}
          >
            Delete Lead
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
))

LeadRow.displayName = "LeadRow"

export function LeadsTable({ onLeadClick }: LeadsTableProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const debouncedSearch = useDebounce(search, 300)

  const { leads, pagination, isLoading, error, mutate } = useLeads({
    page,
    search: debouncedSearch,
    status,
    sortBy,
    sortOrder,
  })

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }, [sortBy])

  const handleClearFilters = () => {
    setSearch("")
    setStatus("all")
    setPage(1)
  }

  const handleDelete = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // In a real app we'd use a custom dialog, but keeping it simple for now
    if (!confirm("Are you sure you want to delete this lead?")) return
    
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete lead")
      }

      toast.success("Lead deleted successfully")
      mutate()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete lead")
    }
  }, [mutate])

  if (error) return (
    <div className="p-8 text-center border border-dashed rounded-xl border-destructive/20 bg-destructive/5">
      <p className="text-destructive font-medium text-sm">Failed to load leads. Please try refreshing the page.</p>
    </div>
  )

  const isFiltered = search !== "" || status !== "all"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10 h-11 bg-secondary/10 border-border/50 focus:ring-primary/20 text-sm"
              aria-label="Search leads"
            />
          </div>
          {isFiltered && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-foreground text-xs font-semibold uppercase tracking-widest"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={status} onValueChange={(val) => {
            setStatus(val)
            setPage(1)
          }}>
            <SelectTrigger className="w-full sm:w-[180px] h-11 bg-secondary/10 border-border/50 text-sm" aria-label="Filter by status">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground/40" />
                <SelectValue placeholder="All Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="backdrop-blur-xl bg-card/95 border-border/50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="won">Won</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/20 shadow-none overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/5">
              <TableRow className="hover:bg-transparent border-b border-border/30">
                <TableHead className="h-14 pl-8 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 cursor-pointer transition-colors hover:text-primary" onClick={() => handleSort("first_name")}>
                  <div className="flex items-center">
                    Name 
                    <ArrowUpDown className={cn("ml-2 h-3 w-3 opacity-0 transition-opacity", sortBy === "first_name" && "opacity-100 text-primary")} />
                  </div>
                </TableHead>
                <TableHead className="h-14 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Email</TableHead>
                <TableHead className="h-14 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Phone</TableHead>
                <TableHead className="h-14 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 cursor-pointer hover:text-primary" onClick={() => handleSort("source")}>
                  <div className="flex items-center">
                    Source
                    <ArrowUpDown className={cn("ml-2 h-3 w-3 opacity-0", sortBy === "source" && "opacity-100 text-primary")} />
                  </div>
                </TableHead>
                <TableHead className="h-14 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 cursor-pointer hover:text-primary" onClick={() => handleSort("status")}>
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className={cn("ml-2 h-3 w-3 opacity-0", sortBy === "status" && "opacity-100 text-primary")} />
                  </div>
                </TableHead>
                <TableHead className="h-14 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 cursor-pointer hover:text-primary" onClick={() => handleSort("created_at")}>
                  <div className="flex items-center">
                    Created
                    <ArrowUpDown className={cn("ml-2 h-3 w-3 opacity-0", sortBy === "created_at" && "opacity-100 text-primary")} />
                  </div>
                </TableHead>
                <TableHead className="h-14 w-[50px] pr-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-border/30">
                    <TableCell className="py-4"><Skeleton className="h-4 w-32 bg-secondary/20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40 bg-secondary/20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32 bg-secondary/20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-secondary/20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full bg-secondary/20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-secondary/20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md bg-secondary/20" /></TableCell>
                  </TableRow>
                ))
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-[400px] text-center">
                    <EmptyState
                      title={isFiltered ? "No matching leads" : "Your lead list is empty"}
                      description={isFiltered ? "Try adjusting your search or filters." : "Start by adding your first lead to the system."}
                      icon={UserPlus}
                      action={isFiltered ? (
                        <Button variant="outline" onClick={handleClearFilters} className="h-10 px-6">Clear all filters</Button>
                      ) : undefined}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <LeadRow 
                    key={lead.id} 
                    lead={lead} 
                    onLeadClick={onLeadClick} 
                    onDelete={handleDelete} 
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {isLoading ? (
            <Skeleton className="h-4 w-40 bg-secondary/20" />
          ) : (
            <>Showing <span className="text-foreground">{leads.length}</span> of <span className="text-foreground">{pagination.total}</span> leads</>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || isLoading}
            className="h-10 px-5 border-border/50 bg-secondary/5 hover:bg-secondary/20 text-xs font-semibold uppercase tracking-widest"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <div className="text-[11px] font-bold uppercase tracking-widest min-w-[100px] text-center text-muted-foreground">
            Page {page} <span className="mx-1 text-muted-foreground/30">/</span> {pagination.totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages || pagination.totalPages === 0 || isLoading}
            className="h-10 px-5 border-border/50 bg-secondary/5 hover:bg-secondary/20 text-xs font-semibold uppercase tracking-widest"
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
