"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Lead } from "@/types/leads"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Building2, Calendar, GripVertical } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface KanbanCardProps {
  lead: Lead
  isOverlay?: boolean
}

export function KanbanCard({ lead, isOverlay }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: "Lead",
      lead,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[140px] w-full rounded-xl border border-dashed border-primary/30 bg-primary/5"
      />
    )
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group cursor-grab active:cursor-grabbing transition-all duration-500 border-border/50 shadow-none hover:border-primary/40 bg-card/40 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-card/60 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
        isOverlay && "border-primary/60 ring-8 ring-primary/5 scale-[1.05] shadow-2xl z-50 rotate-2 bg-card/95 backdrop-blur-xl"
      )}
    >
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight">
              {lead.first_name} {lead.last_name}
            </h4>
            {lead.company && (
              <div className="flex items-center text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
                <Building2 className="mr-2 h-3 w-3 text-muted-foreground/30" /> {lead.company}
              </div>
            )}
          </div>
          <div className="p-1.5 rounded-lg bg-secondary/30 text-muted-foreground/30 group-hover:text-primary/40 group-hover:bg-primary/5 transition-all">
            <GripVertical className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-3">
          {lead.email && (
            <div className="flex items-center text-xs text-muted-foreground/70 font-medium">
              <div className="w-6 h-6 rounded-md bg-secondary/30 flex items-center justify-center mr-3 group-hover:bg-primary/5 transition-colors">
                <Mail className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary/50" />
              </div>
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center text-xs text-muted-foreground/70 font-medium">
              <div className="w-6 h-6 rounded-md bg-secondary/30 flex items-center justify-center mr-3 group-hover:bg-primary/5 transition-colors">
                <Phone className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary/50" />
              </div>
              <span>{lead.phone}</span>
            </div>
          )}
        </div>

        <div className="pt-5 border-t border-border/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
            <Calendar className="h-3 w-3" />
            {format(new Date(lead.created_at), "MMM d")}
          </div>
          <div className="flex items-center gap-3">
            {lead.value && (
              <div className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 shadow-sm shadow-primary/10">
                ${lead.value.toLocaleString()}
              </div>
            )}
            <div className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] bg-secondary/30 px-2.5 py-1 rounded-lg border border-border/50">
              {lead.source || "Direct"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
