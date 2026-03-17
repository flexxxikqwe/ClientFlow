"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { 
  X, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  DollarSign, 
  User, 
  MessageSquare,
  Plus,
  Loader2,
  Trash2,
  Sparkles,
  BrainCircuit,
  Zap,
  Reply
} from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { format } from "date-fns"
import { Lead } from "@/types/leads"
import { generateSummary, classifyLead, generateReply } from "@/lib/ai/gemini"
import { useUsers } from "@/features/auth/hooks/use-users"
import { useLead } from "@/features/leads/hooks/use-leads"
import { LeadInfoTab } from "./lead-info-tab"
import { LeadAiTab } from "./lead-ai-tab"
import { Skeleton } from "@/components/ui/skeleton"

interface LeadDetailsProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function LeadDetails({ lead: initialLead, isOpen, onClose, onUpdate }: LeadDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const [formData, setFormData] = useState<Partial<Lead>>({})
  const [aiSummary, setAiSummary] = useState<{ summary: string, keyPoints: string[] } | null>(null)
  const [aiClassification, setAiClassification] = useState<{ priority: string, reasoning: string } | null>(null)
  const [aiReply, setAiReply] = useState<{ subject: string, body: string } | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)

  const { lead, isLoading: isLeadLoading, mutate: mutateLead } = useLead(initialLead?.id || null)
  const { users } = useUsers()

  useEffect(() => {
    if (lead) {
      setFormData({
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        status: lead.status,
        value: lead.value,
        owner_id: lead.owner_id,
        message: lead.message
      })
    }
  }, [lead])

  const handleUpdate = useCallback(async () => {
    if (!lead) return
    setIsActionLoading(true)
    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error("Update failed")
      toast.success("Lead updated successfully")
      setIsEditing(false)
      mutateLead()
      onUpdate()
    } catch (error) {
      toast.error("Failed to update lead")
    } finally {
      setIsActionLoading(false)
    }
  }, [lead, formData, mutateLead, onUpdate])

  const handleAddNote = useCallback(async () => {
    if (!lead || !noteContent.trim()) return
    setIsActionLoading(true)
    try {
      const response = await fetch(`/api/leads/${lead.id}/notes`, {
        method: "POST",
        body: JSON.stringify({ content: noteContent })
      })
      if (!response.ok) throw new Error("Failed to add note")
      toast.success("Note added")
      setNoteContent("")
      mutateLead()
      onUpdate()
    } catch (error) {
      toast.error("Failed to add note")
    } finally {
      setIsActionLoading(false)
    }
  }, [lead, noteContent, mutateLead, onUpdate])

  const handleDelete = useCallback(async () => {
    if (!lead || !confirm("Are you sure you want to delete this lead?")) return
    setIsActionLoading(true)
    try {
      const response = await fetch(`/api/leads/${lead.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Delete failed")
      toast.success("Lead deleted")
      onClose()
      onUpdate()
    } catch (error) {
      toast.error("Failed to delete lead")
    } finally {
      setIsActionLoading(false)
    }
  }, [lead, onClose, onUpdate])

  const handleAiAction = useCallback(async (action: "summary" | "classify" | "reply") => {
    if (!lead) return
    setIsAiLoading(true)
    const context = `
      Name: ${lead.first_name} ${lead.last_name}
      Company: ${lead.company}
      Status: ${lead.status}
      Value: ${lead.value}
      Message: ${lead.message}
      Notes: ${lead.notes?.map(n => n.content).join("; ")}
    `
    try {
      if (action === "summary") {
        const result = await generateSummary(context)
        setAiSummary(result)
        toast.success("Summary generated")
      } else if (action === "classify") {
        const result = await classifyLead(context)
        setAiClassification(result)
        toast.success("Lead classified")
      } else if (action === "reply") {
        const result = await generateReply(context)
        setAiReply(result)
        toast.success("Reply generated")
      }
    } catch (error) {
      toast.error(`Failed to ${action}`)
    } finally {
      setIsAiLoading(false)
    }
  }, [lead])

  const handleCopyReply = useCallback(() => {
    if (aiReply) {
      navigator.clipboard.writeText(aiReply.body)
      toast.success("Reply copied to clipboard")
    }
  }, [aiReply])

  if (!initialLead) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold">
                {lead?.first_name} {lead?.last_name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Building2 className="h-3 w-3" /> {lead?.company || "No company"}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit Details"}
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Details */}
          <div className="w-1/2 border-r p-6 overflow-y-auto space-y-6">
            {isLeadLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : lead && (
              <Tabs defaultValue="info">
                <TabsList className="w-full">
                  <TabsTrigger value="info" className="flex-1">Information</TabsTrigger>
                  <TabsTrigger value="message" className="flex-1">Inquiry</TabsTrigger>
                  <TabsTrigger value="ai" className="flex-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-sky-500" /> AI Assistant
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="info">
                  <LeadInfoTab 
                    lead={lead}
                    formData={formData}
                    setFormData={setFormData}
                    isEditing={isEditing}
                    users={users}
                    isLoading={isActionLoading}
                    onUpdate={handleUpdate}
                  />
                </TabsContent>

                <TabsContent value="message" className="mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                    <p className="text-sm leading-relaxed italic text-slate-600 dark:text-slate-300">
                      &quot;{lead.message || "No message provided with this lead."}&quot;
                    </p>
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
            )}
          </div>

          {/* Right Side: Notes */}
          <div className="w-1/2 flex flex-col bg-slate-50/30 dark:bg-slate-900/30">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Notes
              </h3>
              <span className="text-xs text-muted-foreground">{lead?.notes?.length || 0} notes</span>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              {isLeadLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {lead?.notes?.map((note) => (
                    <div key={note.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg border shadow-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-sky-600">{note.author?.full_name || "System"}</span>
                        <span className="text-[10px] text-muted-foreground">{format(new Date(note.created_at), "MMM d, h:mm a")}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{note.content}</p>
                    </div>
                  ))}
                  {(!lead?.notes || lead.notes.length === 0) && (
                    <div className="text-center py-12 opacity-50">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">No notes yet</p>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t bg-white dark:bg-slate-900">
              <div className="relative">
                <Textarea 
                  placeholder="Add a note..." 
                  className="min-h-[100px] pr-12"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                />
                <Button 
                  size="icon" 
                  className="absolute bottom-2 right-2 h-8 w-8"
                  onClick={handleAddNote}
                  disabled={isActionLoading || !noteContent.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
