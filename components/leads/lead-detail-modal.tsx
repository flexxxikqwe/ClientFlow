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
import { LeadAiTab } from "./lead-ai-tab"
import { Database } from "@/types/supabase"
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
  
  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState<any>(null)
  const [aiClassification, setAiClassification] = useState<any>(null)
  const [aiReply, setAiReply] = useState<any>(null)

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

  const onSubmit = async (values: any) => {
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
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAiAction = async (action: "summary" | "classify" | "reply") => {
    if (!lead) return
    setIsAiLoading(true)
    try {
      const res = await fetch("/api/ai/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, lead }),
      })
      if (!res.ok) throw new Error("AI processing failed")
      const data = await res.json()
      
      if (action === "summary") setAiSummary(data)
      if (action === "classify") setAiClassification(data)
      if (action === "reply") setAiReply(data)
      
      toast.success("AI analysis complete")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleCopyReply = () => {
    if (aiReply) {
      navigator.clipboard.writeText(`Subject: ${aiReply.subject}\n\n${aiReply.body}`)
      toast.success("Reply copied to clipboard")
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
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!lead) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              {lead.first_name} {lead.last_name}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="ai">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 py-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input {...form.register("first_name")} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input {...form.register("last_name")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" {...form.register("email")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" {...form.register("phone")} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" {...form.register("company")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Deal Value ($)</Label>
                  <Input type="number" {...form.register("value")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={form.watch("status")} 
                    onValueChange={(val) => form.setValue("status", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assign Manager</Label>
                  <Select 
                    value={form.watch("owner_id") || "unassigned"} 
                    onValueChange={(val) => form.setValue("owner_id", val === "unassigned" ? null : val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>{u.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 py-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4" />
                Created on {format(new Date(lead.created_at), "PPP")}
              </div>
              
              {lead.message && (
                <div className="space-y-2 mb-6">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Initial Message
                  </Label>
                  <div className="text-sm p-3 bg-white dark:bg-slate-900 rounded border italic">
                    &quot;{lead.message}&quot;
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Label>Internal Notes</Label>
                <Textarea placeholder="Add a note about this lead..." className="min-h-[100px]" />
                <Button variant="secondary" size="sm">Add Note</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <LeadAiTab 
              isAiLoading={isAiLoading}
              onAiAction={handleAiAction}
              aiSummary={aiSummary}
              aiClassification={aiClassification}
              aiReply={aiReply}
              onCopyReply={handleCopyReply}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
