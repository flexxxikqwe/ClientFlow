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
    <div className="mt-4 space-y-6">
      <div className="grid grid-cols-1 gap-3">
        <Button 
          variant="outline" 
          className="justify-start gap-2 h-12" 
          onClick={() => onAiAction("summary")}
          disabled={isAiLoading}
        >
          <BrainCircuit className="h-4 w-4 text-sky-500" />
          {isAiLoading ? "Processing..." : "Generate Smart Summary"}
        </Button>
        <Button 
          variant="outline" 
          className="justify-start gap-2 h-12" 
          onClick={() => onAiAction("classify")}
          disabled={isAiLoading}
        >
          <Zap className="h-4 w-4 text-amber-500" />
          {isAiLoading ? "Processing..." : "Classify Lead Priority"}
        </Button>
        <Button 
          variant="outline" 
          className="justify-start gap-2 h-12" 
          onClick={() => onAiAction("reply")}
          disabled={isAiLoading}
        >
          <Reply className="h-4 w-4 text-emerald-500" />
          {isAiLoading ? "Processing..." : "Draft AI Reply"}
        </Button>
      </div>

      {aiSummary && (
        <div className="p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-100 dark:border-sky-800 space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" /> Summary
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300">{aiSummary.summary}</p>
          <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
            {aiSummary.keyPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {aiClassification && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800 space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Zap className="h-4 w-4" /> Classification: 
            <span className={`uppercase ${
              aiClassification.priority === 'hot' ? 'text-red-600' : 
              aiClassification.priority === 'warm' ? 'text-amber-600' : 'text-blue-600'
            }`}>
              {aiClassification.priority}
            </span>
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300">{aiClassification.reasoning}</p>
        </div>
      )}

      {aiReply && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Reply className="h-4 w-4" /> Draft Reply
          </h4>
          <div className="space-y-2">
            <p className="text-xs font-bold">Subject: {aiReply.subject}</p>
            <div className="p-3 bg-white dark:bg-slate-900 rounded border text-sm whitespace-pre-wrap">
              {aiReply.body}
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="w-full text-xs"
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
