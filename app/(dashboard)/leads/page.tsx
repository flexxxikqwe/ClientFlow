"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Users, Plus, BarChart3, TrendingUp, Clock, Loader2, Download } from "lucide-react"
import useSWR, { mutate } from "swr"
import { toast } from "sonner"

import { LeadsTable } from "@/components/leads/leads-table"
import { LeadDetails } from "@/components/leads/lead-details"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Lead } from "@/types/leads"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const { data: analytics, isLoading: isAnalyticsLoading } = useSWR("/api/analytics?days=30", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  })

  const handleLeadClick = useCallback((lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailsOpen(true)
  }, [])

  const handleUpdate = useCallback(() => {
    mutate((key) => typeof key === 'string' && key.startsWith('/api/leads'))
    mutate("/api/analytics?days=30")
  }, [])

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    try {
      const res = await fetch('/api/leads?limit=1000')
      const data = await res.json()
      const leads = data.leads || []
      
      if (leads.length === 0) {
        toast.error("No leads to export")
        return
      }

      const headers = ["First Name", "Last Name", "Email", "Phone", "Company", "Status", "Value", "Created At"]
      const csvContent = [
        headers.join(","),
        ...leads.map((l: any) => [
          `"${l.first_name}"`,
          `"${l.last_name}"`,
          `"${l.email || ""}"`,
          `"${l.phone || ""}"`,
          `"${l.company || ""}"`,
          `"${l.status}"`,
          l.value || 0,
          `"${l.created_at}"`
        ].join(","))
      ].join("\n")

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Leads exported successfully")
    } catch (error) {
      toast.error("Failed to export leads")
    } finally {
      setIsExporting(false)
    }
  }, [])

  const stats = useMemo(() => [
    {
      title: "Total Leads",
      value: analytics?.stats?.totalLeads?.toLocaleString() || 0,
      icon: Users,
      description: "Last 30 days",
      color: "text-blue-600"
    },
    {
      title: "Pipeline Value",
      value: `$${analytics?.stats?.pipelineValue?.toLocaleString() || 0}`,
      icon: BarChart3,
      description: "Total value",
      color: "text-indigo-600"
    },
    {
      title: "Conversion Rate",
      value: `${analytics?.stats?.conversionRate || 0}%`,
      icon: TrendingUp,
      description: "Won / Total",
      color: "text-emerald-600"
    },
    {
      title: "Active Leads",
      value: (analytics?.stats?.totalLeads || 0) - (analytics?.stats?.wonLeads || 0),
      icon: Clock,
      description: "Excluding Won",
      color: "text-amber-600"
    }
  ], [analytics])

  return (
    <div className="p-8 lg:p-12 space-y-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Leads Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and manage your sales pipeline efficiently.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="shadow-sm" 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isAnalyticsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              )}
              <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Active Pipeline</h2>
        </div>
        <div className="rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
          <LeadsTable onLeadClick={handleLeadClick} />
        </div>
      </div>

      <LeadDetails 
        lead={selectedLead} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        onUpdate={handleUpdate}
      />
    </div>
  )
}
