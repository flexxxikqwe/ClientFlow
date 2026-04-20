"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Target, PieChart as PieChartIcon } from "lucide-react"
import { LeadsPerDayChartClient } from "@/components/analytics/leads-per-day-chart-client"
import { LeadsBySourceChartClient } from "@/components/analytics/leads-by-source-chart-client"
import { useDemoLeads } from "@/components/demo/demo-leads-context"
import { deriveAnalytics } from "@/features/leads/utils/analytics-derivation"
import { Skeleton } from "@/components/ui/skeleton"

export default function DemoAnalyticsPage() {
  const demoLeads = useDemoLeads()
  const isInitialized = demoLeads?.isInitialized ?? false
  const leads = useMemo(() => demoLeads?.leads || [], [demoLeads])
  
  const { stats, leadsPerDay, leadsBySource } = useMemo(() => deriveAnalytics(leads), [leads])

  return (
    <div className="p-6 md:p-12 space-y-10 md:space-y-16 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Analytics & Reports</h2>
            <div className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest">
              Showcase
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground/80">Deep dive into your sales performance and lead acquisition trends.</p>
        </div>
        <div className="p-4 rounded-2xl bg-secondary/20 border border-border/50 flex items-center gap-6">
          {!isInitialized ? (
            <Skeleton className="h-10 w-48 bg-secondary/10 rounded-xl" />
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Data Period</p>
                <p className="text-sm font-bold">Last 30 Days</p>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Sample Size</p>
                <p className="text-sm font-bold">{stats.totalLeads} Leads</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-10 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50 bg-card/30 backdrop-blur-sm shadow-none rounded-2xl overflow-hidden">
          <CardHeader className="p-8 border-b border-border/30">
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
              Lead Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[400px] w-full relative" aria-label="Lead growth chart showing lead acquisition over time">
              {!isInitialized ? (
                <Skeleton className="absolute inset-0 bg-secondary/10 rounded-xl" />
              ) : (
                <LeadsPerDayChartClient data={leadsPerDay} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/30 backdrop-blur-sm shadow-none rounded-2xl overflow-hidden">
          <CardHeader className="p-8 border-b border-border/30">
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
              <PieChartIcon className="h-5 w-5 text-primary" aria-hidden="true" />
              Leads by Source
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[400px] w-full relative" aria-label="Leads by source distribution chart">
              {!isInitialized ? (
                <Skeleton className="absolute inset-0 bg-secondary/10 rounded-xl" />
              ) : (
                <LeadsBySourceChartClient data={leadsBySource} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-10 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2">
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm shadow-none rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground/50 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Conversion Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isInitialized ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-16 bg-secondary/20" />
                    <Skeleton className="h-2 w-full bg-secondary/10" />
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold">{stats.conversionRate}%</div>
                    <div 
                      className="w-full bg-secondary/30 h-2 rounded-full mt-4 overflow-hidden"
                      role="progressbar"
                      aria-valuenow={stats.conversionRate}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Conversion rate progress"
                    >
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${stats.conversionRate}%` }} 
                      />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-4">Target: 45%</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/30 backdrop-blur-sm shadow-none rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground/50 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Lead Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isInitialized ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-20 bg-secondary/20" />
                    <Skeleton className="h-3 w-32 bg-secondary/10" />
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold">{stats.totalLeads}</div>
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-4">+12% from last month</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
