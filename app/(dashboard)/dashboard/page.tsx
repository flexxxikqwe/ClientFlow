"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, TrendingUp, CheckCircle2, BarChart3 } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { LeadsPerDayChart } from "@/components/analytics/leads-per-day-chart"
import { useUser } from "@/features/auth/context/user-context"
import { fetcher } from "@/lib/utils/fetcher"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { user, isLoading: isUserLoading, refreshUser } = useUser()
  const hasRetriedUnauthorized = useRef(false)
  const { data, isLoading, error, mutate } = useSWR(
    (!isUserLoading && user) ? [`/api/analytics`, user.id] : null, 
    ([url]) => fetcher(url)
  )

  // If we have a 401 error, it means the session is invalid.
  // We should wait for useAuth to redirect us instead of showing an error screen.
  const isUnauthorized = error?.status === 401

  useEffect(() => {
    if (!isUnauthorized || hasRetriedUnauthorized.current || !user) {
      return
    }

    hasRetriedUnauthorized.current = true

    const retryAfterSessionRefresh = async () => {
      const refreshedUser = await refreshUser()
      if (refreshedUser) {
        await mutate()
      }
    }

    retryAfterSessionRefresh()
  }, [isUnauthorized, user, refreshUser, mutate])

  if (error && !isUnauthorized) {
    return (
      <div className="p-12 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive font-bold uppercase tracking-widest text-xs">Failed to load analytics</p>
          <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">{error.info?.details || error.message}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Leads",
      value: data?.stats?.totalLeads ?? 0,
      icon: Users,
      description: "Total leads in database",
      color: "text-primary",
    },
    {
      title: "New Leads",
      value: data?.leadsPerDay?.[data.leadsPerDay.length - 1]?.count ?? 0,
      icon: UserPlus,
      description: "Leads added today",
      color: "text-primary",
    },
    {
      title: "Won Leads",
      value: data?.stats?.wonLeads ?? 0,
      icon: CheckCircle2,
      description: "Leads with 'Won' status",
      color: "text-primary",
    },
    {
      title: "Conversion Rate",
      value: `${data?.stats?.conversionRate ?? 0}%`,
      icon: TrendingUp,
      description: "Won / Total ratio",
      color: "text-primary",
    }
  ]

  const isDataLoading = isLoading || isUserLoading || isUnauthorized

  return (
    <div className="p-12 space-y-16 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard Overview</h2>
        <p className="text-sm font-medium text-muted-foreground/80">Welcome back! Here is what is happening with your leads today.</p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card/30 backdrop-blur-sm shadow-none rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:bg-card/50 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">{stat.title}</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                <stat.icon className={cn("h-4 w-4 transition-colors", stat.color, "group-hover:text-primary")} />
              </div>
            </CardHeader>
            <CardContent>
              {isDataLoading ? (
                <Skeleton className="h-10 w-24 mt-1 bg-secondary/20" />
              ) : (
                <div className="text-4xl font-semibold tracking-tight text-foreground">{stat.value}</div>
              )}
              <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mt-4">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-10 grid-cols-1 lg:grid-cols-6">
        <Card className="lg:col-span-4 border-border/50 bg-card/30 backdrop-blur-sm shadow-none rounded-2xl overflow-hidden">
          <CardHeader className="p-8 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  Lead Acquisition
                </CardTitle>
                <p className="text-sm font-medium text-muted-foreground/60">Daily lead volume over the last 30 days</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] h-10 px-6 border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-secondary/20">
                <Link href="/dashboard/analytics">View Reports</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {isDataLoading ? (
              <Skeleton className="h-[400px] w-full rounded-xl bg-secondary/10" />
            ) : (
              <div className="h-[400px] w-full">
                <LeadsPerDayChart data={data?.leadsPerDay || []} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/50 bg-card/30 backdrop-blur-sm shadow-none rounded-2xl overflow-hidden">
          <CardHeader className="p-8 border-b border-border/30">
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            <p className="text-sm font-medium text-muted-foreground/60">Common tasks to get you started</p>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <Button asChild variant="outline" className="w-full justify-start h-14 rounded-xl bg-secondary/20 hover:bg-secondary/40 border-border/50 text-foreground font-bold text-[10px] uppercase tracking-[0.2em] gap-5 transition-all hover:translate-x-2 group">
              <Link href="/dashboard/leads?create=true">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                  <UserPlus className="h-4 w-4 text-primary" />
                </div>
                Add New Lead
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-14 rounded-xl bg-secondary/20 hover:bg-secondary/40 border-border/50 text-foreground font-bold text-[10px] uppercase tracking-[0.2em] gap-5 transition-all hover:translate-x-2 group">
              <Link href="/dashboard/analytics">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                View Analytics
              </Link>
            </Button>
            
            <div className="pt-10">
              <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">Pro Tip</p>
                <p className="text-xs font-medium leading-relaxed text-muted-foreground/80">Use the AI Assistant in Lead Details to quickly summarize long inquiries and generate professional replies.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
