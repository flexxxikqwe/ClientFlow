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
import { Lead } from "@/types/leads"
import { toast } from "sonner"

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
    className="group cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
    onClick={() => onLeadClick(lead)}
  >
    <TableCell className="py-4">
      <div className="font-medium text-slate-900 dark:text-slate-100">
        {lead.first_name} {lead.last_name}
      </div>
    </TableCell>
    <TableCell>
      <div className="text-sm">{lead.email || "-"}</div>
    </TableCell>
    <TableCell>
      <div className="text-sm">{lead.phone || "-"}</div>
    </TableCell>
    <TableCell>
      <div className="text-sm capitalize">{lead.source || "Direct"}</div>
    </TableCell>
    <TableCell>
      <LeadStatusBadge status={lead.status} />
    </TableCell>
    <TableCell className="text-muted-foreground text-sm">
      {format(new Date(lead.created_at), "MMM d, yyyy")}
    </TableCell>
    <TableCell onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onLeadClick(lead)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive"
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

  const handleDelete = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this lead?")) return
    
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Lead deleted successfully")
      mutate()
    } catch (err) {
      toast.error("Failed to delete lead")
    }
  }, [mutate])

  if (error) return <div className="p-4 text-destructive">Failed to load leads</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
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

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
            <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-800">
              <TableHead className="h-11 font-medium text-slate-500 cursor-pointer" onClick={() => handleSort("first_name")}>
                Name <ArrowUpDown className="ml-2 h-3 w-3 inline opacity-50" />
              </TableHead>
              <TableHead className="h-11 font-medium text-slate-500">Email</TableHead>
              <TableHead className="h-11 font-medium text-slate-500">Phone</TableHead>
              <TableHead className="h-11 font-medium text-slate-500 cursor-pointer" onClick={() => handleSort("source")}>
                Source <ArrowUpDown className="ml-2 h-3 w-3 inline opacity-50" />
              </TableHead>
              <TableHead className="h-11 font-medium text-slate-500 cursor-pointer" onClick={() => handleSort("status")}>
                Status <ArrowUpDown className="ml-2 h-3 w-3 inline opacity-50" />
              </TableHead>
              <TableHead className="h-11 font-medium text-slate-500 cursor-pointer" onClick={() => handleSort("created_at")}>
                Created <ArrowUpDown className="ml-2 h-3 w-3 inline opacity-50" />
              </TableHead>
              <TableHead className="h-11 w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-[400px]">
                  <EmptyState
                    title="No leads found"
                    description="Try adjusting your search or filters to find what you're looking for."
                    icon={UserPlus}
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {leads.length} of {pagination.total} leads
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="text-sm font-medium">
            Page {page} of {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages || isLoading}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
