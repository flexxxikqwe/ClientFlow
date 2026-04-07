"use client"

import { useState } from "react"
import useSWR from "swr"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  RefreshCcw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { LeadsPerDayChart } from "@/components/analytics/leads-per-day-chart"
import { LeadsBySourceChart } from "@/components/analytics/leads-by-source-chart"

import { useUser } from "@/features/auth/context/user-context"
import { fetcher } from "@/lib/utils/fetcher"

export default function AnalyticsPage() {
  const { isDemo } = useUser()
  const [days, setDays] = useState("30")
  const { data, error, isLoading, mutate } = useSWR(`/api/analytics?days=${days}`, fetcher)

  if (error) return (
    <div className="p-12 text-center border border-dashed rounded-xl border-destructive/20 bg-destructive/5 m-12">
      <p className="text-destructive font-semibold text-sm">Failed to load analytics. Please try refreshing.</p>
    </div>
  )

  return (
    <div className="p-12 space-y-16 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter text-foreground">Analytics Insights</h1>
          <p className="text-sm text-muted-foreground/60 font-medium max-w-md leading-relaxed">Monitor your sales performance and lead trends with real-time data visualization and AI-powered insights.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-full md:w-[220px] h-12 bg-card/30 border-border/30 shadow-none rounded-xl backdrop-blur-xl transition-all hover:bg-secondary/20 font-bold text-[10px] uppercase tracking-[0.2em]">
              <Calendar className="mr-3 h-4 w-4 text-primary/60" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/30 backdrop-blur-2xl bg-card/95 p-2">
              <SelectItem value="7" className="rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] py-3">Last 7 days</SelectItem>
              <SelectItem value="30" className="rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] py-3">Last 30 days</SelectItem>
              <SelectItem value="90" className="rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] py-3">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => mutate()}
            className="h-12 w-12 rounded-xl border-border/30 shadow-none bg-card/30 backdrop-blur-xl transition-all hover:bg-secondary/20 group"
          >
            <RefreshCcw className={cn("h-4 w-4 text-muted-foreground/50 transition-all group-hover:text-primary", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard 
          title="Total Leads" 
          value={data?.stats?.totalLeads} 
          icon={Users} 
          loading={isLoading}
          description="Total leads in system"
        />
        <StatsCard 
          title="Won Leads" 
          value={data?.stats?.wonLeads} 
          icon={TrendingUp} 
          loading={isLoading}
          color="text-primary"
          description="Successfully converted"
        />
        <StatsCard 
          title="Conversion Rate" 
          value={`${data?.stats?.conversionRate}%`} 
          icon={BarChart3} 
          loading={isLoading}
          color="text-primary"
          description="Lead to customer ratio"
        />
        <StatsCard 
          title="Pipeline Value" 
          value={`$${data?.stats?.pipelineValue?.toLocaleString()}`} 
          icon={DollarSign} 
          loading={isLoading}
          color="text-primary"
          description="Estimated total value"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 border-border/30 bg-card/30 backdrop-blur-sm shadow-none rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-border/20 p-10 bg-card/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold tracking-tight text-foreground">Leads Trend</CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Daily lead volume over time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            {isLoading ? (
              <Skeleton className="h-[450px] w-full rounded-2xl bg-secondary/10" />
            ) : (
              <div className="h-[450px] w-full">
                <LeadsPerDayChart data={data?.leadsPerDay || []} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/30 bg-card/30 backdrop-blur-sm shadow-none rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-border/20 p-10 bg-card/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold tracking-tight text-foreground">Leads by Source</CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Distribution channels</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            {isLoading ? (
              <Skeleton className="h-[450px] w-full rounded-2xl bg-secondary/10" />
            ) : (
              <div className="h-[450px] w-full">
                <LeadsBySourceChart data={(data?.leadsBySource || []).map(item => ({ name: item.source, value: item.count }))} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, loading, color = "text-primary", description }: any) {
  return (
    <Card className="border-border/50 bg-card/30 backdrop-blur-sm shadow-none rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:bg-card/50 group">
      <CardHeader className="flex flex-row items-center justify-between pb-6 space-y-0">
        <CardTitle className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center transition-colors group-hover:bg-primary/10">
          <Icon className={cn("h-4 w-4 transition-colors", color, "group-hover:text-primary")} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-10 w-24 mt-1 bg-secondary/20" />
        ) : (
          <div className="text-4xl font-semibold tracking-tight text-foreground mt-1">{value ?? 0}</div>
        )}
        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mt-4">{description}</p>
      </CardContent>
    </Card>
  )
}
