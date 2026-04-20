import React from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  itemName?: string
  previewList?: string[]
  isLoading?: boolean
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  previewList,
  isLoading = false
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-background shadow-2xl rounded-[2rem]">
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed mt-1">
                {description}
              </DialogDescription>
            </DialogHeader>
          </div>

          {(itemName || (previewList && previewList.length > 0)) && (
            <div className="p-4 rounded-xl bg-secondary/20 border border-border/50 space-y-3">
              {itemName && (
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-1">Target</p>
                  <p className="text-sm font-semibold text-foreground truncate">{itemName}</p>
                </div>
              )}
              {previewList && previewList.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-1.5">Selected Items</p>
                  <div className="flex flex-wrap gap-2">
                    {previewList.slice(0, 3).map((name, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-background/50 border border-border/50 text-[10px] font-bold text-foreground truncate max-w-[120px]">
                        {name}
                      </span>
                    ))}
                    {previewList.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-secondary/30 text-[10px] font-bold text-muted-foreground">
                        +{previewList.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-secondary/20"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl shadow-lg shadow-destructive/20 font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </div>
        </div>
        <div className="h-1.5 w-full bg-destructive/20" />
      </DialogContent>
    </Dialog>
  )
}
