"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { Users, Plus, BarChart3, TrendingUp, Clock, LayoutGrid, Table as TableIcon } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

import { DemoLeadsTableWrapper } from "@/components/demo/demo-leads-table-wrapper"
import { LeadKanban } from "@/components/leads/lead-kanban"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useDemoLeads } from "@/components/demo/demo-leads-context"

function DemoLeadsPageContent() {
  const demoLeads = useDemoLeads()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const leads = useMemo(() => demoLeads?.leads || [], [demoLeads])
  const [viewMode, setViewMode] = useState<"table" | "kanban">((searchParams.get("view") as "table" | "kanban") || "table")

  // Sync viewMode to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (viewMode !== "table") params.set("view", viewMode)
    else params.delete("view")
    
    const query = params.toString()
    const url = `${pathname}${query ? `?${query}` : ""}`
    router.replace(url, { scroll: false })
  }, [viewMode, pathname, router, searchParams])

  const stats = useMemo(() => {
// ... existing stats logic
    const totalLeads = leads.length
    const wonLeads = leads.filter(l => l.status.toLowerCase() === "won").length
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0"
    const activeLeads = leads.filter(l => l.status.toLowerCase() !== "won").length

    return [
      {
        title: "Total Leads",
        value: totalLeads.toLocaleString(),
        icon: Users,
        description: "Last 30 days",
        color: "text-primary"
      },
      {
        title: "Pipeline Value",
        value: `$${(totalLeads * 1200).toLocaleString()}`,
        icon: BarChart3,
        description: "Total value",
        color: "text-primary"
      },
      {
        title: "Conversion Rate",
        value: `${conversionRate}%`,
        icon: TrendingUp,
        description: "Won / Total",
        color: "text-primary"
      },
      {
        title: "Active Leads",
        value: activeLeads.toLocaleString(),
        icon: Clock,
        description: "Excluding Won",
        color: "text-primary"
      }
    ]
  }, [leads])

  return (
    <div className="p-6 md:p-12 space-y-10 md:space-y-16 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Leads Management</h1>
            <div className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest">
              Showcase
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground/80">Track, manage and convert your sales opportunities with ease.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <DemoLeadsTableWrapper />
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
              <div className="text-4xl font-semibold tracking-tight text-foreground mt-1">{stat.value}</div>
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
        <DemoLeadsTableWrapper isTableOnly viewMode={viewMode} />
      </div>
    </div>
  )
}

export default function DemoLeadsPage() {
  return (
    <Suspense fallback={
      <div className="p-6 md:p-12 space-y-10 md:space-y-16 max-w-[1600px] mx-auto animate-pulse">
        <div className="h-20 bg-secondary/20 rounded-2xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-secondary/20 rounded-2xl" />
          ))}
        </div>
        <div className="h-[600px] bg-secondary/20 rounded-2xl" />
      </div>
    }>
      <DemoLeadsPageContent />
    </Suspense>
  )
}
