import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LeadStatusBadgeProps {
  status: string
  className?: string
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const variants: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    contacted: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    qualified: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    lost: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    won: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    closed: "bg-secondary/50 text-muted-foreground border-border/50"
  }

  return (
    <Badge 
      variant="outline" 
      className={cn("text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md border", variants[status] || "bg-secondary/50 text-muted-foreground border-border/50", className)}
    >
      {status}
    </Badge>
  )
}
