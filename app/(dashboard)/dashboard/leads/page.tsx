"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Users, Plus, BarChart3, TrendingUp, Clock, Loader2 } from "lucide-react"
import useSWR, { mutate } from "swr"

import { LeadsTable } from "@/components/leads/leads-table"
import { LeadDetails } from "@/components/leads/lead-details"
import { CreateLeadModal } from "@/components/leads/create-lead-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Lead } from "@/types/leads"
import { toast } from "sonner"

import { useUser } from "@/features/auth/context/user-context"
import { LocalStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function LeadsPage() {
  const { isDemo } = useUser()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { data: analytics, mutate: mutateAnalytics, isLoading: isAnalyticsLoading } = useSWR("local_analytics", () => LocalStore.getAnalytics())

  const handleLeadClick = useCallback((lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailsOpen(true)
  }, [])

  const handleUpdate = useCallback(() => {
    mutate("local_leads")
    mutateAnalytics()
  }, [mutateAnalytics])

  const handleExport = () => {
    toast.info("Export feature coming soon!")
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
          <Button variant="outline" className="flex-1 md:flex-none h-11 px-6 rounded-xl shadow-none border-border/50 font-bold text-[10px] uppercase tracking-[0.2em] bg-background/50 backdrop-blur-sm transition-all hover:bg-secondary/20" onClick={handleExport}>
            Export CSV
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
        </div>
        <LeadsTable onLeadClick={handleLeadClick} />
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
    </div>
  )
}
