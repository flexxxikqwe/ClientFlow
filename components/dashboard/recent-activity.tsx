"use client"

import { 
  UserPlus, 
  ArrowRightLeft, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

export type ActivityType = 
  | "lead_created" 
  | "stage_changed" 
  | "note_added" 
  | "ai_insight" 
  | "lead_won" 
  | "lead_lost"

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: Date
  leadName?: string
  metadata?: Record<string, any>
}

const ACTIVITY_ICONS = {
  lead_created: { icon: UserPlus, color: "text-blue-500", bg: "bg-blue-500/10" },
  stage_changed: { icon: ArrowRightLeft, color: "text-amber-500", bg: "bg-amber-500/10" },
  note_added: { icon: FileText, color: "text-slate-500", bg: "bg-slate-500/10" },
  ai_insight: { icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
  lead_won: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  lead_lost: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
}

interface RecentActivityProps {
  activities: ActivityItem[]
  className?: string
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center">
          <Clock className="h-6 w-6 text-muted-foreground/40" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground tracking-tight">No recent activity</p>
          <p className="text-xs text-muted-foreground/60">Activity will appear here as you manage leads.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-8", className)}>
      {activities.map((activity, i) => {
        const config = ACTIVITY_ICONS[activity.type] || { icon: Clock, color: "text-slate-500", bg: "bg-slate-500/10" }
        const Icon = config.icon

        return (
          <div key={activity.id} className="flex gap-4 group relative">
            {/* Connector Line */}
            {i !== activities.length - 1 && (
              <div className="absolute left-5 top-10 bottom-[-2rem] w-px bg-border/30 group-hover:bg-primary/20 transition-colors" />
            )}
            
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110",
              config.bg
            )}>
              <Icon className={cn("h-5 w-5", config.color)} />
            </div>
            
            <div className="space-y-1 pt-0.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground tracking-tight leading-none">
                  {activity.title}
                </p>
                {activity.timestamp && (
                  <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">
                    • {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-muted-foreground/80 leading-relaxed">
                {activity.description}
              </p>
              {activity.leadName && (
                <div className="pt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary/50 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border border-border/50">
                    {activity.leadName}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
