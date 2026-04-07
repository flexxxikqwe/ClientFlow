"use client"

import React, { useState, useEffect } from "react"
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
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Lead } from "@/types/leads"
import { KanbanCard } from "./kanban-card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface KanbanBoardProps {
  initialLeads: Lead[]
  stages: { id: string; name: string }[]
  onUpdate?: () => void
}

export function KanbanBoard({ initialLeads, stages, onUpdate }: KanbanBoardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  )

  useEffect(() => {
    setLeads(initialLeads)
  }, [initialLeads])

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Lead") {
      setActiveLead(event.active.data.current.lead)
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveALead = active.data.current?.type === "Lead"
    const isOverALead = over.data.current?.type === "Lead"
    const isOverAColumn = over.data.current?.type === "Column"

    if (!isActiveALead) return

    // Dropping a Lead over another Lead
    if (isActiveALead && isOverALead) {
      setLeads((leads) => {
        const activeIndex = leads.findIndex((l) => l.id === activeId)
        const overIndex = leads.findIndex((l) => l.id === overId)

        if (leads[activeIndex].stage_id !== leads[overIndex].stage_id) {
          const newLeads = [...leads]
          newLeads[activeIndex] = { ...newLeads[activeIndex], stage_id: leads[overIndex].stage_id }
          return arrayMove(newLeads, activeIndex, overIndex - 1)
        }

        return arrayMove(leads, activeIndex, overIndex)
      })
    }

    // Dropping a Lead over a Column
    if (isActiveALead && isOverAColumn) {
      setLeads((leads) => {
        const activeIndex = leads.findIndex((l) => l.id === activeId)
        const newLeads = [...leads]
        newLeads[activeIndex] = { ...newLeads[activeIndex], stage_id: overId as string }
        return arrayMove(newLeads, activeIndex, activeIndex)
      })
    }
  }

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveLead(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeLead = leads.find((l) => l.id === activeId)
    if (!activeLead) return

    const newStageId = over.data.current?.type === "Column" 
      ? (overId as string) 
      : leads.find((l) => l.id === overId)?.stage_id

    if (newStageId && activeLead.stage_id !== newStageId) {
      setIsUpdating(true)
      try {
        const response = await fetch(`/api/leads/${activeId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stage_id: newStageId }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to move lead")
        }

        toast.success("Lead moved successfully")
        onUpdate?.()
      } catch (error: any) {
        toast.error(error.message || "Failed to move lead")
        // Revert local state if needed, but SWR revalidation will handle it
        onUpdate?.()
      } finally {
        setIsUpdating(false)
      }
    }
  }

  return (
    <div className="flex gap-10 h-full overflow-x-auto pb-12 px-4 scrollbar-hide">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        {stages.map((stage) => (
          <div 
            key={stage.id} 
            className="flex flex-col w-[340px] shrink-0 bg-card/20 rounded-2xl border border-border/50 shadow-none backdrop-blur-sm"
          >
            <div className="p-6 flex items-center justify-between border-b border-border/30 bg-secondary/5">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full shadow-sm",
                  stage.id === "new" && "bg-blue-500 shadow-blue-500/20",
                  stage.id === "contacted" && "bg-amber-500 shadow-amber-500/20",
                  stage.id === "qualified" && "bg-indigo-500 shadow-indigo-500/20",
                  stage.id === "lost" && "bg-rose-500 shadow-rose-500/20",
                  stage.id === "won" && "bg-emerald-500 shadow-emerald-500/20"
                )} />
                <h3 className="font-bold text-foreground tracking-[0.15em] text-[10px] uppercase">
                  {stage.name}
                </h3>
              </div>
              <span className="bg-secondary/50 text-muted-foreground/60 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-border/50">
                {leads.filter((l) => l.stage_id === stage.id).length}
              </span>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto min-h-[600px] space-y-6">
              <SortableContext
                items={leads.filter((l) => l.stage_id === stage.id).map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-6 min-h-[200px]">
                  {leads.filter((l) => l.stage_id === stage.id).length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center border border-dashed border-border/30 rounded-2xl bg-secondary/5 opacity-40">
                      <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">Drop here</p>
                    </div>
                  ) : (
                    leads
                      .filter((l) => l.stage_id === stage.id)
                      .map((lead) => (
                        <KanbanCard key={lead.id} lead={lead} />
                      ))
                  )}
                </div>
              </SortableContext>
            </div>
          </div>
        ))}

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}>
          {activeLead ? <KanbanCard lead={activeLead} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
      
      {isUpdating && (
        <div className="fixed bottom-8 right-8 bg-card border border-border/50 shadow-2xl rounded-lg px-4 py-2.5 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 backdrop-blur-xl">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Updating pipeline...</span>
        </div>
      )}
    </div>
  )
}
