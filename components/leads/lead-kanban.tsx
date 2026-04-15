"use client"

import React, { useMemo } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  useDroppable,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Lead } from "@/types/leads"
import { Card, CardContent } from "@/components/ui/card"
import { LeadStatusBadge } from "@/components/leads/lead-status-badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { 
  MoreHorizontal, 
  GripVertical, 
  Sparkles, 
  MessageSquare, 
  UserCheck, 
  Trophy, 
  XCircle,
  Clock,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"

const STAGES = [
  { id: "new", name: "New", color: "blue", icon: Sparkles },
  { id: "contacted", name: "Contacted", color: "amber", icon: MessageSquare },
  { id: "qualified", name: "Qualified", color: "purple", icon: UserCheck },
  { id: "won", name: "Won", color: "emerald", icon: Trophy },
  { id: "lost", name: "Lost", color: "slate", icon: XCircle },
]

const STAGE_COLORS: Record<string, string> = {
  blue: "border-blue-500/20 bg-blue-500/5 text-blue-500",
  amber: "border-amber-500/20 bg-amber-500/5 text-amber-500",
  purple: "border-purple-500/20 bg-purple-500/5 text-purple-500",
  emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-500",
  slate: "border-slate-500/20 bg-slate-500/5 text-slate-500",
}

const STAGE_DOT_COLORS: Record<string, string> = {
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  purple: "bg-purple-500",
  emerald: "bg-emerald-500",
  slate: "bg-slate-500",
}

interface LeadKanbanProps {
  leads: Lead[]
  onLeadClick: (lead: Lead) => void
  onStatusChange?: (leadId: string, newStatus: string) => void
}

export function LeadKanban({ leads, onLeadClick, onStatusChange }: LeadKanbanProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const [activeId, setActiveId] = React.useState<string | null>(null)
  const activeLead = useMemo(() => leads.find((l) => l.id === activeId), [leads, activeId])

  const groupedLeads = useMemo(() => {
    const groups: Record<string, Lead[]> = {
      new: [],
      contacted: [],
      qualified: [],
      won: [],
      lost: [],
    }
    leads.forEach((lead) => {
      const status = lead.status.toLowerCase()
      if (groups[status]) {
        groups[status].push(lead)
      } else {
        groups.new.push(lead)
      }
    })
    return groups
  }, [leads])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeLeadId = active.id as string
    const overId = over.id as string

    // Find which column we dropped into
    // It could be the column itself or a lead inside the column
    let newStatus: string | undefined

    const overStage = STAGES.find(s => s.id === overId)
    if (overStage) {
      newStatus = overStage.id
    } else {
      const overLead = leads.find(l => l.id === overId)
      if (overLead) {
        newStatus = overLead.status.toLowerCase()
      }
    }

    if (newStatus && onStatusChange) {
      const lead = leads.find(l => l.id === activeLeadId)
      if (lead && lead.status.toLowerCase() !== newStatus) {
        onStatusChange(activeLeadId, newStatus)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-8 overflow-x-auto pb-8 min-h-[700px] -mx-6 px-6 scrollbar-hide">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage.id}
            id={stage.id}
            title={stage.name}
            color={stage.color}
            icon={stage.icon}
            leads={groupedLeads[stage.id]}
            onLeadClick={onLeadClick}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.4',
            },
          },
        }),
      }}>
        {activeId && activeLead ? (
          <div className="rotate-3 scale-105 transition-transform duration-200">
            <LeadCard lead={activeLead} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanColumn({ 
  id, 
  title, 
  color, 
  icon: Icon, 
  leads, 
  onLeadClick 
}: { 
  id: string, 
  title: string, 
  color: string, 
  icon: any, 
  leads: Lead[], 
  onLeadClick: (lead: Lead) => void 
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  const totalValue = useMemo(() => {
    return leads.reduce((sum, lead) => sum + (lead.value || 0), 0)
  }, [leads])

  return (
    <div className="flex-shrink-0 w-[320px] flex flex-col gap-5">
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-xl border flex items-center justify-center shadow-sm",
            STAGE_COLORS[color]
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/90">{title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                {leads.length} {leads.length === 1 ? "Lead" : "Leads"}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">
                ${totalValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className={cn(
          "flex-1 bg-secondary/5 rounded-[2rem] p-4 space-y-4 border border-border/10 min-h-[500px] transition-all duration-300",
          isOver && "bg-primary/5 border-primary/20 ring-4 ring-primary/5"
        )}
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <SortableLeadCard key={lead.id} lead={lead} onLeadClick={onLeadClick} />
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-border/20 rounded-[1.5rem]">
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-muted-foreground/20" />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
                Drop leads here
              </p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  )
}

function SortableLeadCard({ lead, onLeadClick }: { lead: Lead, onLeadClick: (lead: Lead) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-0 rounded-2xl h-32"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onLeadClick(lead)}
      className="outline-none"
    >
      <LeadCard lead={lead} />
    </div>
  )
}

function LeadCard({ lead, isOverlay = false }: { lead: Lead, isOverlay?: boolean }) {
  const stage = STAGES.find(s => s.id === lead.status.toLowerCase()) || STAGES[0]

  return (
    <Card className={cn(
      "border-border/50 bg-card/40 backdrop-blur-md shadow-none rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300 hover:border-primary/40 hover:bg-card/60 group relative",
      isOverlay && "shadow-2xl border-primary/50 bg-card/80 scale-105 cursor-grabbing"
    )}>
      {/* Stage accent line */}
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full opacity-40 group-hover:opacity-100 transition-opacity",
        STAGE_DOT_COLORS[stage.color]
      )} />

      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", STAGE_DOT_COLORS[stage.color])} />
              <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] truncate">
                {lead.company || "Individual"}
              </p>
            </div>
            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
              {lead.first_name} {lead.last_name}
            </h4>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <GripVertical className="h-4 w-4 text-muted-foreground/10 group-hover:text-muted-foreground/30 transition-colors" />
            {lead.priority && (
              <div className={cn(
                "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                lead.priority === 'high' ? "bg-red-500/10 text-red-500" : 
                lead.priority === 'medium' ? "bg-amber-500/10 text-amber-500" : 
                "bg-blue-500/10 text-blue-500"
              )}>
                {lead.priority}
              </div>
            )}
            {lead.source && (
              <div className="px-1.5 py-0.5 rounded bg-secondary/50 text-muted-foreground/60 text-[8px] font-black uppercase tracking-widest">
                {lead.source}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/10">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-3 w-3 text-primary" />
            </div>
            <span className="text-[11px] font-black text-foreground/90 tracking-tight">
              {lead.value ? lead.value.toLocaleString() : "0"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground/40">
            <Clock className="h-3 w-3" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              {lead.created_at ? format(new Date(lead.created_at), "MMM d") : "-"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
