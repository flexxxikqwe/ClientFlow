"use client"

import React, { useState } from "react"
import { KanbanBoard } from "@/components/pipeline/kanban-board"
import { Kanban, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateLeadModal } from "@/components/leads/create-lead-modal"
import { Skeleton } from "@/components/ui/skeleton"
import useSWR from "swr"

import { useLeads } from "@/features/leads/hooks/use-leads"
import { fetcher } from "@/lib/utils/fetcher"
import { useUser } from "@/features/auth/context/user-context"

export default function PipelinePage() {
  const { isDemo } = useUser()
  const { leads, isLoading: isLeadsLoading, mutate: mutateLeads } = useLeads({ limit: 1000 })
  const { data: stagesData, isLoading: isStagesLoading } = useSWR("/api/pipeline", fetcher)
  const stages = stagesData?.stages || []
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const isLoading = isLeadsLoading || isStagesLoading

  if (isLoading) {
    return (
      <div className="p-12 space-y-12">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-[700px] rounded-xl" />
          <Skeleton className="h-[700px] rounded-xl" />
          <Skeleton className="h-[700px] rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background animate-in fade-in duration-700">
      <div className="p-12 border-b border-border/30 bg-card/20 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="w-14 h-14 bg-secondary/30 border border-border/50 rounded-2xl flex items-center justify-center shadow-inner">
            <Kanban className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Sales Pipeline</h1>
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.3em]">Visual Deal Management</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="flex-1 overflow-hidden p-12 bg-secondary/5">
        <KanbanBoard initialLeads={leads || []} stages={stages || []} onUpdate={mutateLeads} />
      </div>

      <CreateLeadModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={mutateLeads}
      />
    </div>
  )
}
