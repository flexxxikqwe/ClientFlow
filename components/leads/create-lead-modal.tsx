"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface CreateLeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateLeadModal({ isOpen, onClose, onSuccess }: CreateLeadModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    value: "",
    status: "new"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          value: formData.value ? parseFloat(formData.value) : 0,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create lead")
      }

      toast.success("Lead created successfully")
      onSuccess()
      onClose()
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        company: "",
        value: "",
        status: "new"
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Create New Lead</DialogTitle>
          <DialogDescription className="text-muted-foreground/60">
            Add a new potential client to your sales pipeline.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="first_name"
                required
                minLength={1}
                maxLength={50}
                placeholder="John"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="h-11 bg-secondary/10 border-border/50 focus:ring-primary/20"
                data-testid="first-name-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="last_name"
                required
                minLength={1}
                maxLength={50}
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="h-11 bg-secondary/10 border-border/50 focus:ring-primary/20"
                data-testid="last-name-input"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-11 bg-secondary/10 border-border/50 focus:ring-primary/20"
              data-testid="email-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Company</Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="h-11 bg-secondary/10 border-border/50 focus:ring-primary/20"
              data-testid="company-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Value ($)</Label>
              <Input
                id="value"
                type="number"
                min="0"
                step="0.01"
                placeholder="5000"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="h-11 bg-secondary/10 border-border/50 focus:ring-primary/20"
                data-testid="value-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger className="h-11 bg-secondary/10 border-border/50" data-testid="status-select">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl bg-card/95 border-border/50">
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="h-11 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
              data-testid="submit-lead-button"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create Lead"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
