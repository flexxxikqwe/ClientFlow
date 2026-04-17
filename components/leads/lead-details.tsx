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
import { useUser } from "@/features/auth/context/user-context"
import { safeJson } from "@/lib/utils/safe-json"
import { usePathname } from "next/navigation"

interface LeadDetailsProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function LeadDetails({ lead: initialLead, isOpen, onClose, onUpdate }: LeadDetailsProps) {
  const { isDemo: isUserDemo } = useUser()
  const pathname = usePathname()
  const isDemoMode = isUserDemo || pathname.startsWith("/demo")
  const [isEditing, setIsEditing] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const [formData, setFormData] = useState<Partial<Lead>>({})
  const [aiSummary, setAiSummary] = useState<{ summary: string, keyPoints: string[] } | null>(null)
  const [aiClassification, setAiClassification] = useState<{ priority: string, reasoning: string } | null>(null)
  const [aiReply, setAiReply] = useState<{ subject: string, body: string } | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)

  const { lead, isLoading, mutate: mutateLead } = useLead(initialLead?.id || null)
  
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
    if (isDemoMode) {
      toast.info("Showcase Mode: Lead updates are disabled in this preview.")
      return
    }
    setIsActionLoading(true)
    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await safeJson(response)
        throw new Error(data?.error || "Failed to update lead")
      }

      toast.success("Lead updated successfully")
      setIsEditing(false)
      mutateLead()
      onUpdate()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update lead"
      toast.error(message)
    } finally {
      setIsActionLoading(false)
    }
  }, [lead, formData, mutateLead, onUpdate, isDemoMode])

  const handleAddNote = useCallback(async () => {
    if (!lead || !noteContent.trim()) return
    if (isDemoMode) {
      toast.info("Showcase Mode: Adding notes is disabled in this preview.")
      return
    }
    setIsActionLoading(true)
    try {
      const response = await fetch(`/api/leads/${lead.id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: noteContent,
        }),
      })

      if (!response.ok) {
        const data = await safeJson(response)
        throw new Error(data?.error || "Failed to add note")
      }

      toast.success("Note added")
      setNoteContent("")
      mutateLead()
      onUpdate()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to add note"
      toast.error(message)
    } finally {
      setIsActionLoading(false)
    }
  }, [lead, noteContent, mutateLead, onUpdate, isDemoMode])

  const handleDelete = useCallback(async () => {
    if (!lead) return
    if (isDemoMode) {
      toast.info("Showcase Mode: Lead deletion is disabled in this preview.")
      return
    }
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) return
    setIsActionLoading(true)
    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await safeJson(response)
        throw new Error(data?.error || "Failed to delete lead")
      }

      toast.success("Lead deleted successfully")
      onClose()
      onUpdate()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete lead"
      toast.error(message)
    } finally {
      setIsActionLoading(false)
    }
  }, [lead, onClose, onUpdate, isDemoMode])

  const handleAiAction = useCallback(async (action: "summary" | "classify" | "reply") => {
    if (!lead) return
    setIsAiLoading(true)

    // Handle Demo Mode Mock AI
    if (isDemoMode && lead.id.startsWith("demo-")) {
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate "thinking"
      
      const insights = lead.ai_insights
      if (insights) {
        if (action === "summary" && insights.summary) {
          setAiSummary(insights.summary)
          toast.success("Summary generated (Demo Mode)")
        } else if (action === "classify" && insights.classification) {
          setAiClassification(insights.classification)
          toast.success("Lead classified (Demo Mode)")
        } else if (action === "reply" && insights.reply) {
          setAiReply(insights.reply)
          toast.success("Reply generated (Demo Mode)")
        }
        setIsAiLoading(false)
        return
      }
    }

    const context = `
      Name: ${lead.first_name} ${lead.last_name}
      Company: ${lead.company}
      Status: ${lead.status}
      Value: ${lead.value}
      Message: ${lead.message}
      Notes: ${lead.notes?.map((n: { content: string }) => n.content).join("; ")}
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
  }, [lead, isDemoMode])

  const handleCopyReply = useCallback(() => {
    if (aiReply) {
      navigator.clipboard.writeText(aiReply.body)
      toast.success("Reply copied to clipboard")
    }
  }, [aiReply])

  if (!initialLead) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden border-border bg-background shadow-2xl rounded-[2rem] dark:bg-card">
        <DialogHeader className="p-10 border-b border-border/10 bg-secondary/5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-violet-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <Avatar className="h-20 w-20 border-4 border-background shadow-2xl relative">
                  <AvatarImage src={`https://avatar.vercel.sh/${lead?.email}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-black italic">
                    {lead?.first_name?.charAt(0)}{lead?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-4xl font-bold tracking-tighter text-foreground">
                  {lead?.first_name} {lead?.last_name}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-primary/60" /> {lead?.company || "Independent"}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary/60" /> {lead ? format(new Date(lead.created_at), "MMMM d, yyyy") : ""}
                  </div>
                </DialogDescription>
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="h-12 px-8 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-secondary/20" 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              <Button 
                variant="destructive" 
                className="h-12 w-12 rounded-xl shadow-xl shadow-destructive/10 transition-all hover:scale-105 active:scale-95" 
                onClick={handleDelete}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Details */}
          <div className="w-3/5 border-r border-border/20 p-10 overflow-y-auto space-y-10 bg-card/10">
            {isLoading ? (
              <div className="space-y-8">
                <Skeleton className="h-14 w-full rounded-2xl bg-secondary/20" />
                <Skeleton className="h-80 w-full rounded-2xl bg-secondary/20" />
                <Skeleton className="h-80 w-full rounded-2xl bg-secondary/20" />
              </div>
            ) : lead && (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="w-full bg-secondary/30 p-1.5 h-16 rounded-2xl mb-10 border border-border/20">
                  <TabsTrigger value="info" className="flex-1 h-13 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all">Information</TabsTrigger>
                  <TabsTrigger value="message" className="flex-1 h-13 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all">Inquiry</TabsTrigger>
                  <TabsTrigger value="ai" className="flex-1 h-13 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> AI Insights
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

                <TabsContent value="message" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-10 bg-card/30 backdrop-blur-sm rounded-3xl border border-border/30 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-primary/50 group-hover:bg-primary transition-colors duration-500" />
                    <p className="text-xl leading-relaxed font-medium text-foreground/80 italic selection:bg-primary/20">
                      &quot;{lead.message || "No message provided with this lead."}&quot;
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          <div className="w-2/5 flex flex-col bg-card/20 backdrop-blur-sm">
            <div className="p-8 border-b border-border/20 flex items-center justify-between bg-card/30">
              <h3 className="font-bold text-foreground flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                Activity Timeline
              </h3>
              <div className="px-4 py-1.5 rounded-full bg-primary/10 text-[10px] font-black text-primary uppercase tracking-[0.2em] border border-primary/20">
                {lead?.notes?.length || 0} Events
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-8">
              {isLoading ? (
                <div className="space-y-8">
                  <Skeleton className="h-28 w-full rounded-2xl bg-secondary/20" />
                  <Skeleton className="h-28 w-full rounded-2xl bg-secondary/20" />
                  <Skeleton className="h-28 w-full rounded-2xl bg-secondary/20" />
                </div>
              ) : (
                <div className="space-y-8">
                  {lead?.notes?.map((note: { id: string, author?: { full_name: string }, created_at: string, content: string }) => (
                    <div key={note.id} className="bg-card/40 p-6 rounded-2xl border border-border/30 space-y-4 transition-all hover:border-primary/30 hover:bg-card/60 group">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                            <User className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <span className="text-xs font-bold text-foreground">{note.author?.full_name || "System"}</span>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">{format(new Date(note.created_at), "MMM d, h:mm a")}</span>
                      </div>
                      <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">{note.content}</p>
                    </div>
                  ))}
                  {(!lead?.notes || lead.notes.length === 0) && (
                    <div className="text-center py-32 opacity-20">
                      <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">No activity history</p>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="p-8 border-t border-border/20 bg-card/30">
              <div className="relative group">
                <Textarea 
                  placeholder="Log an activity or internal note..." 
                  className="min-h-[140px] rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-primary/20 transition-all pr-16 py-6 text-sm font-medium resize-none"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  data-testid="note-input"
                />
                <Button 
                  size="icon" 
                  className="absolute bottom-4 right-4 h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  onClick={handleAddNote}
                  disabled={isActionLoading || !noteContent.trim()}
                  data-testid="add-note-button"
                >
                  {isActionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
