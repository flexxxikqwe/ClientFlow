"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Save, Trash2, User, Building2, Mail, Phone, Calendar, MessageSquare } from "lucide-react"
import { format } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lead } from "@/types/leads"

const leadSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email().nullable().optional().or(z.literal("")),
  phone: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  status: z.string(),
  value: z.coerce.number().nullable().optional(),
  owner_id: z.string().uuid().nullable().optional(),
})

interface LeadDetailModalProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function LeadDetailModal({ lead, isOpen, onClose, onUpdate }: LeadDetailModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [users, setUsers] = useState<{ id: string; full_name: string }[]>([])

  const form = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      status: "",
      value: 0,
      owner_id: "",
    },
  })

  useEffect(() => {
    if (lead) {
      form.reset({
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        status: lead.status,
        value: lead.value || 0,
        owner_id: lead.owner_id || "",
      })
    }
  }, [lead, form])

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    }
    if (isOpen) fetchUsers()
  }, [isOpen])

  const onSubmit = async (values: z.infer<typeof leadSchema>) => {
    if (!lead) return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error("Failed to update lead")
      toast.success("Lead updated successfully")
      onUpdate()
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update lead"
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!lead || !confirm("Are you sure you want to delete this lead?")) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/leads/${lead.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete lead")
      toast.success("Lead deleted")
      onUpdate()
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete lead"
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!lead) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-border/50 bg-card/95 backdrop-blur-xl p-0 gap-0 shadow-2xl">
        <DialogHeader className="p-8 pb-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
                {lead.first_name} {lead.last_name}
              </DialogTitle>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Lead Details & Management</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </DialogHeader>

        <div className="p-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/30 p-1 rounded-lg mb-8">
              <TabsTrigger value="details" className="rounded-md text-xs font-semibold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-none">Details</TabsTrigger>
              <TabsTrigger value="activity" className="rounded-md text-xs font-semibold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-none">Activity & Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-0">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">First Name</Label>
                    <Input {...form.register("first_name")} className="bg-background/50 border-border/50 focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">Last Name</Label>
                    <Input {...form.register("last_name")} className="bg-background/50 border-border/50 focus-visible:ring-primary/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                      <Input className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/20" {...form.register("email")} />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                      <Input className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/20" {...form.register("phone")} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">Company</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                      <Input className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/20" {...form.register("company")} />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">Deal Value ($)</Label>
                    <Input type="number" {...form.register("value")} className="bg-background/50 border-border/50 focus-visible:ring-primary/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">Status</Label>
                    <Select 
                      value={form.watch("status")} 
                      onValueChange={(val) => form.setValue("status", val)}
                    >
                      <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border/50 bg-card">
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                        <SelectItem value="won">Won</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">Assign Manager</Label>
                    <Select 
                      value={form.watch("owner_id") || "unassigned"} 
                      onValueChange={(val) => form.setValue("owner_id", val === "unassigned" ? null : val)}
                    >
                      <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary/20">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent className="border-border/50 bg-card">
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>{u.full_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={onClose} className="text-xs font-semibold uppercase tracking-widest h-10 px-6">Cancel</Button>
                  <Button type="submit" disabled={isSaving} className="text-xs font-semibold uppercase tracking-widest h-10 px-6 bg-primary hover:bg-primary/90">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6 mt-0">
              <div className="bg-secondary/20 p-6 rounded-xl border border-border/50 space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  <Calendar className="h-3.5 w-3.5" />
                  Created on {format(new Date(lead.created_at), "PPP")}
                </div>
                
                {lead.message && (
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Initial Message
                    </Label>
                    <div className="text-sm p-4 bg-background/50 rounded-lg border border-border/50 italic text-foreground/80 leading-relaxed">
                      &quot;{lead.message}&quot;
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">Internal Notes</Label>
                  <Textarea placeholder="Add a note about this lead..." className="min-h-[120px] bg-background/50 border-border/50 focus-visible:ring-primary/20" />
                  <Button variant="secondary" size="sm" className="text-[10px] font-semibold uppercase tracking-widest h-8 px-4">Add Note</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
