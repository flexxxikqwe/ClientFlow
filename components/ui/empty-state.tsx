import { LucideIcon, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/20 p-12 text-center animate-in fade-in zoom-in duration-500",
        className
      )}
    >
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-secondary/30 border border-border/50 mb-8 transition-transform duration-500 hover:scale-110">
        <Icon className="h-10 w-10 text-primary/60" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      {description && (
        <p className="mt-3 mb-8 text-sm font-medium text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  )
}
