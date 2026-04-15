"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, TrendingUp, CheckCircle2, BarChart3, Sparkles } from "lucide-react"
import Link from "next/link"
import { LeadsPerDayChartClient } from "@/components/analytics/leads-per-day-chart-client"
import { cn } from "@/lib/utils"
import { DEMO_LEADS_PER_DAY } from "@/lib/demo-data"
import { useDemoLeads } from "@/components/demo/demo-leads-context"

export default function DemoDashboardPage() {
  const demoLeads = useDemoLeads()
  const leads = useMemo(() => demoLeads?.leads || [], [demoLeads])
  
  const stats = useMemo(() => {
    const totalLeads = leads.length
    const wonLeads = leads.filter(l => l.status.toLowerCase() === "won").length
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0"
    
    return [
      {
        title: "Total Leads",
        value: totalLeads.toLocaleString(),
        icon: Users,
        description: "Total leads in session",
        color: "text-primary",
      },
      {
        title: "New Leads",
        value: DEMO_LEADS_PER_DAY[DEMO_LEADS_PER_DAY.length - 1].count,
        icon: UserPlus,
        description: "Leads added today",
        color: "text-primary",
      },
      {
        title: "Won Leads",
        value: wonLeads.toLocaleString(),
        icon: CheckCircle2,
        description: "Leads with 'Won' status",
        color: "text-primary",
      },
      {
        title: "Conversion Rate",
        value: `${conversionRate}%`,
        icon: TrendingUp,
        description: "Won / Total ratio",
        color: "text-primary",
      }
    ]
  }, [leads])

  return (
    <div className="p-6 md:p-12 space-y-10 md:space-y-16 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/20 shadow-2xl shadow-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Sparkles className="h-32 w-32 text-primary" />
        </div>
        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em]">
              Showcase Mode
            </div>
            <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Live Portfolio Preview</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter text-foreground">Welcome to ClientFlow</h1>
          <p className="text-lg font-medium text-muted-foreground/80 max-w-2xl leading-relaxed">
            This is a high-fidelity demonstration of a modern CRM. Explore real-world sales workflows, 
            AI-assisted lead insights, and interactive analytics—all pre-populated with 30 days of stable demo data.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard Overview</h2>
        </div>
        <p className="text-sm font-medium text-muted-foreground/80">Welcome to the ClientFlow portfolio preview. Explore the core CRM features below.</p>
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
              <div className="text-4xl font-semibold tracking-tight text-foreground">{stat.value}</div>
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
                <Link href="/demo/analytics">View Reports</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[400px] w-full relative">
              <LeadsPerDayChartClient data={DEMO_LEADS_PER_DAY} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/50 bg-card/30 backdrop-blur-sm shadow-none rounded-2xl overflow-hidden">
          <CardHeader className="p-8 border-b border-border/30">
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            <p className="text-sm font-medium text-muted-foreground/60">Common tasks to get you started</p>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <Button asChild variant="outline" className="w-full justify-start h-14 rounded-xl bg-secondary/20 hover:bg-secondary/40 border-border/50 text-foreground font-bold text-[10px] uppercase tracking-[0.2em] gap-5 transition-all hover:translate-x-2 group">
              <Link href="/demo/leads">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                  <UserPlus className="h-4 w-4 text-primary" />
                </div>
                Manage Leads
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-14 rounded-xl bg-secondary/20 hover:bg-secondary/40 border-border/50 text-foreground font-bold text-[10px] uppercase tracking-[0.2em] gap-5 transition-all hover:translate-x-2 group">
              <Link href="/demo/analytics">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                View Analytics
              </Link>
            </Button>
            
            <div className="pt-10">
              <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">Demo Intelligence</p>
                <p className="text-xs font-medium leading-relaxed text-muted-foreground/80">
                  This demo environment is populated with 30 days of realistic sales activity. 
                  Explore the <Link href="/demo/analytics" className="text-primary hover:underline">Analytics</Link> tab to see how ClientFlow tracks conversion trends and acquisition volume.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
