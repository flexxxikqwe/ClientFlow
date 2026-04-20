import { Button } from "@/components/ui/button"
import { BrainCircuit, Zap, Reply, Info, CheckCircle2, History, FileText, User } from "lucide-react"
import { Lead } from "@/types/leads"
import { cn } from "@/lib/utils"

interface LeadAiTabProps {
  lead: Lead
  isAiLoading: boolean
  onAiAction: (action: "summary" | "classify" | "reply") => void
  aiSummary: { summary: string, keyPoints: string[] } | null
  aiClassification: { priority: string, reasoning: string } | null
  aiReply: { subject: string, body: string } | null
  onCopyReply: () => void
}

export function LeadAiTab({
  lead,
  isAiLoading,
  onAiAction,
  aiSummary,
  aiClassification,
  aiReply,
  onCopyReply
}: LeadAiTabProps) {
  const hasInquiry = !!lead.message
  const hasActivity = (lead.notes?.length || 0) > 0

  return (
    <div className="mt-6 space-y-8 pb-10">
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-10 space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          <Info className="h-3.5 w-3.5" />
          AI Context Grounding
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/50 transition-all">
            <User className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold text-foreground/80">Lead Profile</span>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/50 transition-all opacity-50 text-muted-foreground",
            hasInquiry && "opacity-100 text-foreground border-primary/30"
          )}>
            <FileText className={cn("h-3 w-3", hasInquiry && "text-primary")} />
            <span className="text-[10px] font-bold">Inquiry Message</span>
            {hasInquiry && <CheckCircle2 className="h-2.5 w-2.5 text-primary ml-1" />}
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/50 transition-all opacity-50 text-muted-foreground",
            hasActivity && "opacity-100 text-foreground border-primary/30"
          )}>
            <History className={cn("h-3 w-3", hasActivity && "text-primary")} />
            <span className="text-[10px] font-bold">Activity History</span>
            {hasActivity && <CheckCircle2 className="h-2.5 w-2.5 text-primary ml-1" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="justify-center flex-col gap-2 h-24 rounded-2xl border-border/50 bg-card/30 hover:bg-secondary/20 shadow-none transition-all duration-200 group relative overflow-hidden" 
          onClick={() => onAiAction("summary")}
          disabled={isAiLoading}
        >
          <div className="absolute top-0 right-0 p-2 opacity-5">
            <BrainCircuit className="h-12 w-12" />
          </div>
          <BrainCircuit className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isAiLoading ? "Thinking..." : "Summarize"}</span>
        </Button>
        <Button 
          variant="outline" 
          className="justify-center flex-col gap-2 h-24 rounded-2xl border-border/50 bg-card/30 hover:bg-secondary/20 shadow-none transition-all duration-200 group relative overflow-hidden" 
          onClick={() => onAiAction("classify")}
          disabled={isAiLoading}
        >
          <div className="absolute top-0 right-0 p-2 opacity-5">
            <Zap className="h-12 w-12" />
          </div>
          <Zap className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isAiLoading ? "Thinking..." : "Classify"}</span>
        </Button>
        <Button 
          variant="outline" 
          className="justify-center flex-col gap-2 h-24 rounded-2xl border-border/50 bg-card/30 hover:bg-secondary/20 shadow-none transition-all duration-200 group relative overflow-hidden" 
          onClick={() => onAiAction("reply")}
          disabled={isAiLoading}
        >
          <div className="absolute top-0 right-0 p-2 opacity-5">
            <Reply className="h-12 w-12" />
          </div>
          <Reply className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isAiLoading ? "Thinking..." : "Draft Reply"}</span>
        </Button>
      </div>

      {aiSummary && (
        <div className="p-8 bg-card/50 rounded-[2rem] border border-border/30 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-xl shadow-primary/5">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BrainCircuit className="h-4 w-4 text-primary" />
              </div>
              Executive Summary
            </h4>
            <div className="text-[9px] font-bold text-muted-foreground/40 bg-secondary/30 px-3 py-1 rounded-full uppercase tracking-widest">
              Context-Aware Logic
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-base text-foreground/90 leading-relaxed font-medium selection:bg-primary/20">{aiSummary.summary}</p>
            <div className="h-px bg-border/20 w-full" />
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiSummary.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/10 border border-border/20 group hover:border-primary/20 transition-colors">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                  <span className="text-xs font-semibold text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {aiClassification && (
        <div className="p-8 bg-card/50 rounded-[2rem] border border-border/30 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-xl shadow-primary/5">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              Priority Intelligence
            </h4>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-sm",
                aiClassification.priority === 'hot' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5' : 
                aiClassification.priority === 'warm' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5' : 
                'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5'
              )}>
                {aiClassification.priority} Priority
              </span>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-secondary/5 border border-border/10">
            <p className="text-sm text-foreground/80 leading-relaxed italic font-medium">
              &quot;{aiClassification.reasoning}&quot;
            </p>
          </div>
        </div>
      )}

      {aiReply && (
        <div className="p-8 bg-card/50 rounded-[2rem] border border-border/30 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-xl shadow-primary/5">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Reply className="h-4 w-4 text-primary" />
              </div>
              Drafted Response
            </h4>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-10 rounded-xl px-6 border-border/50 bg-background/50 backdrop-blur-sm font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-secondary/20"
              onClick={onCopyReply}
            >
              Copy Draft
            </Button>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-secondary/10 border border-border/20">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">Subject</span>
              <span className="text-sm font-bold text-foreground">{aiReply.subject}</span>
            </div>
            <div className="p-8 bg-background/80 rounded-2xl border border-border/50 text-base text-foreground/90 leading-relaxed whitespace-pre-wrap font-medium tracking-tight">
              {aiReply.body}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
