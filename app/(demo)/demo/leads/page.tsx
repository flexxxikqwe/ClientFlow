import { Users, Plus, BarChart3, TrendingUp, Clock } from "lucide-react"

import { DemoLeadsTableWrapper } from "@/components/demo/demo-leads-table-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DEMO_STATS } from "@/lib/demo-data"

export default function DemoLeadsPage() {
  const stats = [
    {
      title: "Total Leads",
      value: DEMO_STATS.totalLeads.toLocaleString(),
      icon: Users,
      description: "Last 30 days",
      color: "text-primary"
    },
    {
      title: "Pipeline Value",
      value: `$${(DEMO_STATS.totalLeads * 1200).toLocaleString()}`,
      icon: BarChart3,
      description: "Total value",
      color: "text-primary"
    },
    {
      title: "Conversion Rate",
      value: `${DEMO_STATS.conversionRate}%`,
      icon: TrendingUp,
      description: "Won / Total",
      color: "text-primary"
    },
    {
      title: "Active Leads",
      value: (DEMO_STATS.totalLeads - DEMO_STATS.wonLeads).toLocaleString(),
      icon: Clock,
      description: "Excluding Won",
      color: "text-primary"
    }
  ]

  return (
    <div className="p-12 space-y-16 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Leads Management</h1>
            <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
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
        </div>
        <DemoLeadsTableWrapper isTableOnly />
      </div>
    </div>
  )
}
