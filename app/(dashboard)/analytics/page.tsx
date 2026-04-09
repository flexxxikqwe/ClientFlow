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
import { LeadsPerDayChart } from "@/components/analytics/leads-per-day-chart"
import { LeadsBySourceChart } from "@/components/analytics/leads-by-source-chart"
import { fetcher } from "@/lib/utils/fetcher"

export default function AnalyticsPage() {
  const [days, setDays] = useState("30")
  const { data, error, isLoading, mutate } = useSWR(`/api/analytics?days=${days}`, fetcher)

  if (error) return <div className="p-8 text-destructive">Failed to load analytics</div>

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Monitor your sales performance and lead trends.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => mutate()}>
            <RefreshCcw className={isLoading ? "animate-spin h-4 w-4" : "h-4 w-4"} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Leads" 
          value={data?.stats?.totalLeads} 
          icon={Users} 
          loading={isLoading}
        />
        <StatsCard 
          title="Won Leads" 
          value={data?.stats?.wonLeads} 
          icon={TrendingUp} 
          loading={isLoading}
          color="text-emerald-600"
        />
        <StatsCard 
          title="Conversion Rate" 
          value={`${data?.stats?.conversionRate}%`} 
          icon={BarChart3} 
          loading={isLoading}
          color="text-sky-600"
        />
        <StatsCard 
          title="Pipeline Value" 
          value={`$${data?.stats?.pipelineValue?.toLocaleString()}`} 
          icon={DollarSign} 
          loading={isLoading}
          color="text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads Trend</CardTitle>
            <CardDescription>Daily lead volume over the selected period.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <LeadsPerDayChart data={data?.leadsPerDay || []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads by Source</CardTitle>
            <CardDescription>Distribution of leads across channels.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <LeadsBySourceChart data={data?.leadsBySource || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string | number | undefined
  icon: any
  loading?: boolean
  color?: string
}

function StatsCard({ title, value, icon: Icon, loading, color = "text-muted-foreground" }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value ?? 0}</div>
        )}
      </CardContent>
    </Card>
  )
}
