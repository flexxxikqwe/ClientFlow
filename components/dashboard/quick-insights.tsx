"use client"

import { Sparkles, TrendingUp, AlertCircle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InsightItem {
  id: string
  type: "positive" | "neutral" | "warning" | "action"
  title: string
  description: string
}

interface QuickInsightsProps {
  insights: InsightItem[]
  className?: string
}

const INSIGHT_STYLES = {
  positive: { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  neutral: { icon: Sparkles, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  warning: { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  action: { icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
}

export function QuickInsights({ insights, className }: QuickInsightsProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      {insights.map((insight) => {
        const style = INSIGHT_STYLES[insight.type]
        const Icon = style.icon

        return (
          <div 
            key={insight.id} 
            className={cn(
              "p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-default",
              style.bg,
              style.border
            )}
          >
            <div className="flex gap-4">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", "bg-background/50")}>
                <Icon className={cn("h-4 w-4", style.color)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground tracking-tight uppercase tracking-[0.1em]">
                  {insight.title}
                </p>
                <p className="text-[11px] font-medium text-muted-foreground/80 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
