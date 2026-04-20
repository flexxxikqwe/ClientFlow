"use client"

import { useState, useMemo, memo, useEffect } from "react"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  UserPlus
} from "lucide-react"
import { format } from "date-fns"
import { LeadStatusBadge } from "@/components/leads/lead-status-badge"
import { cn } from "@/lib/utils"
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
import { EmptyState } from "@/components/ui/empty-state"
import { DEMO_LEADS } from "@/lib/demo-data"

interface DemoLeadsTableProps {
  leads: Lead[]
  onLeadClick: (lead: Lead) => void
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  status: string
  setStatus: React.Dispatch<React.SetStateAction<string>>
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onSelectAll: (ids: string[]) => void
}

const LeadRow = memo(({ lead, onLeadClick, isSelected, onToggleSelect }: { 
  lead: Lead, 
  onLeadClick: (lead: Lead) => void,
  isSelected: boolean,
  onToggleSelect: (id: string) => void
}) => (
  <TableRow 
    className={cn(
      "group cursor-pointer hover:bg-secondary/15 transition-all duration-300 border-b border-border/20 relative",
      isSelected && "bg-primary/5 hover:bg-primary/10"
    )}
    onClick={() => onLeadClick(lead)}
  >
    <TableCell className="py-5 pl-8 relative" onClick={(e) => e.stopPropagation()}>
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary animate-in fade-in slide-in-from-left-1 duration-300" />
      )}
      <div className="flex items-center justify-center">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => onToggleSelect(lead.id)}
          className="w-4 h-4 rounded border-border/50 bg-secondary/10 text-primary focus:ring-primary/20 cursor-pointer transition-all hover:scale-110"
          aria-label={`Select lead ${lead.first_name} ${lead.last_name}`}
        />
      </div>
    </TableCell>
    <TableCell className="py-5">
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
      {lead.created_at ? format(new Date(lead.created_at), "MMM d, yyyy") : "-"}
    </TableCell>
    <TableCell className="pr-8" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-secondary/50 rounded-lg" aria-label={`Actions for ${lead.first_name} ${lead.last_name}`}>
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
            onClick={() => toast.error("Action not available in demo mode")}
          >
            Delete Lead
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
))

LeadRow.displayName = "LeadRow"

export function DemoLeadsTable({ 
  leads,
  onLeadClick,
  search,
  setSearch,
  status,
  setStatus,
  selectedIds,
  onToggleSelect,
  onSelectAll
}: DemoLeadsTableProps) {
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce search input to avoid filtering on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        debouncedSearch === "" ||
        lead.first_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lead.last_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (lead.email && lead.email.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
        (lead.company && lead.company.toLowerCase().includes(debouncedSearch.toLowerCase()))
      
      const matchesStatus = status === "all" || lead.status.toLowerCase() === status.toLowerCase()
      
      return matchesSearch && matchesStatus
    })
  }, [leads, debouncedSearch, status])

  const handleClearFilters = () => {
    setSearch("")
    setDebouncedSearch("")
    setStatus("all")
  }

  const allFilteredIds = useMemo(() => filteredLeads.map(l => l.id), [filteredLeads])
  const isAllSelected = filteredLeads.length > 0 && filteredLeads.every(l => selectedIds.includes(l.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" aria-hidden="true" />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-secondary/10 border-border/50 focus:ring-primary/20 text-sm"
              aria-label="Search leads by name, email, or company"
            />
          </div>
          {(search !== "" || status !== "all") && (
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
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-[180px] h-11 bg-secondary/10 border-border/50 text-sm">
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
                <TableHead className="h-14 pl-8 w-[50px]">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      onChange={() => onSelectAll(isAllSelected ? [] : allFilteredIds)}
                      className="w-4 h-4 rounded border-border/50 bg-secondary/10 text-primary focus:ring-primary/20 cursor-pointer"
                      aria-label="Select all leads on this page"
                    />
                  </div>
                </TableHead>
                <TableHead className="h-14 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Name</TableHead>
                <TableHead className="h-14 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Email</TableHead>
                <TableHead className="h-14 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Phone</TableHead>
                <TableHead className="h-14 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Source</TableHead>
                <TableHead className="h-14 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Status</TableHead>
                <TableHead className="h-14 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Created</TableHead>
                <TableHead className="h-14 w-[50px] pr-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-[400px] text-center">
                    <EmptyState
                      title="No matching leads"
                      description="Try adjusting your search or filters."
                      icon={UserPlus}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <LeadRow 
                    key={lead.id} 
                    lead={lead as any} 
                    onLeadClick={onLeadClick} 
                    isSelected={selectedIds.includes(lead.id)}
                    onToggleSelect={onToggleSelect}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Showing <span className="text-foreground">{filteredLeads.length}</span> of <span className="text-foreground">{leads.length}</span> leads
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-10 px-5 border-border/50 bg-secondary/5 text-xs font-semibold uppercase tracking-widest opacity-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <div className="text-[11px] font-bold uppercase tracking-widest min-w-[100px] text-center text-muted-foreground">
            Page 1 <span className="mx-1 text-muted-foreground/30">/</span> 1
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-10 px-5 border-border/50 bg-secondary/5 text-xs font-semibold uppercase tracking-widest opacity-50"
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
