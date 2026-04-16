"use client"

import { Trash2, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

interface BulkActionToolbarProps {
  selectedCount: number
  onClearSelection: () => void
  onDelete: () => Promise<void>
  isDeleting?: boolean
}

export function BulkActionToolbar({ 
  selectedCount, 
  onClearSelection, 
  onDelete,
  isDeleting = false
}: BulkActionToolbarProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  if (selectedCount === 0) return null

  return (
    <>
      <div className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-6 px-6 py-3 rounded-2xl",
        "bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/10",
        "animate-in fade-in slide-in-from-bottom-4 duration-300"
      )}>
        <div className="flex items-center gap-3 pr-6 border-r border-border/30">
          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
            {selectedCount}
          </div>
          <span className="text-xs font-bold text-foreground uppercase tracking-widest">
            Leads Selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowConfirm(true)}
            disabled={isDeleting}
            className="h-9 px-4 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 font-bold text-[10px] uppercase tracking-[0.2em] gap-2"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearSelection}
            disabled={isDeleting}
            className="h-9 w-9 p-0 rounded-xl hover:bg-secondary/50"
          >
            <X className="h-4 w-4 text-muted-foreground/40" />
          </Button>
        </div>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="rounded-2xl border-border/50 backdrop-blur-xl bg-card/95 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              Confirm Bulk Delete
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground/60 pt-2">
              You are about to delete <span className="text-foreground font-bold">{selectedCount}</span> leads. 
              This action is permanent and cannot be undone. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-6 flex flex-row gap-3 sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 sm:flex-none rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] border-border/50">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={() => {
                onDelete().then(() => setShowConfirm(false))
              }}
              disabled={isDeleting}
              className="flex-1 sm:flex-none rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? "Deleting..." : "Delete Leads"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
