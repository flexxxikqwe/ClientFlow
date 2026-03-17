"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Lead } from "@/types/leads"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Building2, Calendar } from "lucide-react"
import { format } from "date-fns"

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
        className="h-[140px] w-full rounded-xl border-2 border-dashed border-sky-500/30 bg-sky-50/10"
      />
    )
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group cursor-grab active:cursor-grabbing hover:border-sky-500/50 transition-all shadow-sm ${
        isOverlay ? "border-sky-500 ring-2 ring-sky-500/20" : ""
      }`}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            {lead.first_name} {lead.last_name}
          </div>
          {lead.company && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Building2 className="mr-1 h-3 w-3" /> {lead.company}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          {lead.email && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Mail className="mr-1.5 h-3 w-3" /> {lead.email}
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Phone className="mr-1.5 h-3 w-3" /> {lead.phone}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center text-[10px] text-slate-400 uppercase tracking-wider font-medium">
            <Calendar className="mr-1 h-3 w-3" />
            {format(new Date(lead.created_at), "MMM d")}
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
            {lead.source || "Direct"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
