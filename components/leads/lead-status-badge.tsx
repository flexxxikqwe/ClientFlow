import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LeadStatusBadgeProps {
  status: string
  className?: string
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const variants: Record<string, string> = {
    new: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900",
    contacted: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900",
    qualified: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900",
    lost: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900",
    won: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900",
    closed: "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
  }

  return (
    <Badge 
      variant="outline" 
      className={cn("capitalize font-medium", variants[status] || "bg-slate-100 text-slate-700", className)}
    >
      {status}
    </Badge>
  )
}
