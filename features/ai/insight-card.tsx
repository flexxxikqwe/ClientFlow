import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function InsightCard({ title, content }: { title: string, content: string }) {
  return (
    <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/10">
      <CardHeader className="flex flex-row items-center gap-x-2 pb-2">
        <Sparkles className="h-4 w-4 text-emerald-500" />
        <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          AI Insight: {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">
          {content}
        </p>
      </CardContent>
    </Card>
  )
}
