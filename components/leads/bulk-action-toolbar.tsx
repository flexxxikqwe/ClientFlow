"use client"

import { Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { motion, AnimatePresence } from "motion/react"

interface BulkActionToolbarProps {
  selectedCount: number
  onClearSelection: () => void
  onDelete: () => Promise<void>
  selectedNames?: string[]
  isDeleting?: boolean
}

export function BulkActionToolbar({ 
  selectedCount, 
  onClearSelection, 
  onDelete,
  selectedNames = [],
  isDeleting = false
}: BulkActionToolbarProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  if (selectedCount === 0) return null

  return (
    <>
      <div className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-6 px-6 py-4 rounded-3xl",
        "bg-card/95 backdrop-blur-2xl border border-primary/20 shadow-2xl shadow-primary/10",
        "animate-in fade-in slide-in-from-bottom-4 duration-300 ring-1 ring-white/10"
      )}>
        <div className="flex items-center gap-4 pr-6 border-r border-border/30">
          <div className="relative group">
            <div className="absolute -inset-1 bg-primary blur opacity-25 rounded-lg group-hover:opacity-40 transition-all" />
            <div className="relative w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-sm font-black text-primary-foreground shadow-lg shadow-primary/20">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={selectedCount}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {selectedCount}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground uppercase tracking-widest leading-none">
              Leads
            </span>
            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mt-1">
              Selected
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="default" 
            size="lg" 
            onClick={() => setShowConfirm(true)}
            disabled={isDeleting}
            className="h-11 px-6 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold text-[10px] uppercase tracking-[0.2em] gap-3 shadow-lg shadow-destructive/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Trash2 className="h-4 w-4" />
            Delete Batch
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onClearSelection}
            disabled={isDeleting}
            className="h-11 w-11 rounded-xl border-border/50 bg-background/50 hover:bg-secondary/50 transition-all flex items-center justify-center group"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
          </Button>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={async () => {
          await onDelete()
          setShowConfirm(false)
        }}
        isLoading={isDeleting}
        title="Batch Delete Leads"
        description={`You are about to permanently remove ${selectedCount} leads from your sales pipeline. This action cannot be undone.`}
        previewList={selectedNames}
      />
    </>
  )
}
