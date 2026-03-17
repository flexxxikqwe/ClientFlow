"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, TrendingUp, CheckCircle2, BarChart3 } from "lucide-react"
import useSWR from "swr"
import { Skeleton } from "@/components/ui/skeleton"
import { LeadsPerDayChart } from "@/components/analytics/leads-per-day-chart"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DashboardPage() {
  const { data, isLoading } = useSWR("/api/analytics?days=30", fetcher)

  const stats = [
    {
      title: "Total Leads",
      value: data?.stats?.totalLeads || 0,
      icon: Users,
      description: "Total leads in database",
      color: "text-blue-600"
    },
    {
      title: "New Leads",
      value: data?.leadsPerDay?.[data.leadsPerDay.length - 1]?.count || 0,
      icon: UserPlus,
      description: "Leads added today",
      color: "text-sky-600"
    },
    {
      title: "Converted Leads",
      value: data?.stats?.wonLeads || 0,
      icon: CheckCircle2,
      description: "Leads with 'Won' status",
      color: "text-emerald-600"
    },
    {
      title: "Conversion Rate",
      value: `${data?.stats?.conversionRate || 0}%`,
      icon: TrendingUp,
      description: "Won / Total ratio",
      color: "text-indigo-600"
    }
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here is what is happening with your leads today.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Leads per Day</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <LeadsPerDayChart data={data?.leadsPerDay || []} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
