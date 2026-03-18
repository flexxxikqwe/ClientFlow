import { Button } from "@/components/ui/button"
import { BrainCircuit, Zap, Reply } from "lucide-react"
import { Lead } from "@/types/leads"

interface LeadAiTabProps {
  isAiLoading: boolean
  onAiAction: (action: "summary" | "classify" | "reply") => void
  aiSummary: { summary: string, keyPoints: string[] } | null
  aiClassification: { priority: string, reasoning: string } | null
  aiReply: { subject: string, body: string } | null
  onCopyReply: () => void
}

export function LeadAiTab({
  isAiLoading,
  onAiAction,
  aiSummary,
  aiClassification,
  aiReply,
  onCopyReply
}: LeadAiTabProps) {
  return (
    <div className="mt-6 space-y-8">
      <div className="grid grid-cols-1 gap-3">
        <Button 
          variant="outline" 
          className="justify-start gap-3 h-10 rounded-lg border-border/50 bg-card/30 hover:bg-secondary/50 shadow-none transition-all duration-200" 
          onClick={() => onAiAction("summary")}
          disabled={isAiLoading}
        >
          <BrainCircuit className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium">{isAiLoading ? "Processing..." : "Generate Smart Summary"}</span>
        </Button>
        <Button 
          variant="outline" 
          className="justify-start gap-3 h-10 rounded-lg border-border/50 bg-card/30 hover:bg-secondary/50 shadow-none transition-all duration-200" 
          onClick={() => onAiAction("classify")}
          disabled={isAiLoading}
        >
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium">{isAiLoading ? "Processing..." : "Classify Lead Priority"}</span>
        </Button>
        <Button 
          variant="outline" 
          className="justify-start gap-3 h-10 rounded-lg border-border/50 bg-card/30 hover:bg-secondary/50 shadow-none transition-all duration-200" 
          onClick={() => onAiAction("reply")}
          disabled={isAiLoading}
        >
          <Reply className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium">{isAiLoading ? "Processing..." : "Draft AI Reply"}</span>
        </Button>
      </div>

      {aiSummary && (
        <div className="p-5 bg-secondary/20 rounded-xl border border-border/50 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <BrainCircuit className="h-3.5 w-3.5 text-primary" /> Summary
          </h4>
          <div className="space-y-3">
            <p className="text-sm text-foreground leading-relaxed">{aiSummary.summary}</p>
            <ul className="space-y-2">
              {aiSummary.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {aiClassification && (
        <div className="p-5 bg-secondary/20 rounded-xl border border-border/50 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-primary" /> Classification
          </h4>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
              aiClassification.priority === 'hot' ? 'bg-red-500/10 text-red-500' : 
              aiClassification.priority === 'warm' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
            }`}>
              {aiClassification.priority}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{aiClassification.reasoning}</p>
        </div>
      )}

      {aiReply && (
        <div className="p-5 bg-secondary/20 rounded-xl border border-border/50 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Reply className="h-3.5 w-3.5 text-primary" /> Draft Reply
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Subject:</span>
              <span className="text-xs font-medium text-foreground">{aiReply.subject}</span>
            </div>
            <div className="p-4 bg-background/50 rounded-lg border border-border/50 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono text-[13px]">
              {aiReply.body}
            </div>
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-full h-9 rounded-lg text-xs font-semibold uppercase tracking-widest"
              onClick={onCopyReply}
            >
              Copy to Clipboard
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
