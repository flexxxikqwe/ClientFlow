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
import { MoreHorizontal, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

const STAGES = [
  { id: "new", name: "New" },
  { id: "contacted", name: "Contacted" },
  { id: "qualified", name: "Qualified" },
  { id: "won", name: "Won" },
  { id: "lost", name: "Lost" },
]

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
      <div className="flex gap-6 overflow-x-auto pb-6 min-h-[600px] -mx-6 px-6 scrollbar-hide">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage.id}
            id={stage.id}
            title={stage.name}
            leads={groupedLeads[stage.id]}
            onLeadClick={onLeadClick}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}>
        {activeId && activeLead ? (
          <LeadCard lead={activeLead} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanColumn({ id, title, leads, onLeadClick }: { id: string, title: string, leads: Lead[], onLeadClick: (lead: Lead) => void }) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div className="flex-shrink-0 w-80 flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{title}</h3>
          <span className="px-1.5 py-0.5 rounded-md bg-secondary/50 text-[10px] font-bold text-muted-foreground/40">
            {leads.length}
          </span>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 bg-secondary/5 rounded-2xl p-3 space-y-3 border border-border/10 min-h-[500px]"
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <SortableLeadCard key={lead.id} lead={lead} onLeadClick={onLeadClick} />
          ))}
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
        className="opacity-30 rounded-xl border-2 border-dashed border-primary/20 h-32"
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
    >
      <LeadCard lead={lead} />
    </div>
  )
}

function LeadCard({ lead, isOverlay = false }: { lead: Lead, isOverlay?: boolean }) {
  return (
    <Card className={cn(
      "border-border/50 bg-card/50 backdrop-blur-sm shadow-none rounded-xl overflow-hidden cursor-grab active:cursor-grabbing transition-all hover:border-primary/30 group",
      isOverlay && "shadow-2xl border-primary/40 scale-105 rotate-2 cursor-grabbing"
    )}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              {lead.first_name} {lead.last_name}
            </h4>
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider truncate max-w-[180px]">
              {lead.company || "No Company"}
            </p>
          </div>
          <GripVertical className="h-4 w-4 text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors shrink-0" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/10">
          <div className="text-[10px] font-black text-primary/80">
            {lead.value ? `$${lead.value.toLocaleString()}` : "$0"}
          </div>
          <div className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
            {lead.created_at ? format(new Date(lead.created_at), "MMM d") : "-"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
