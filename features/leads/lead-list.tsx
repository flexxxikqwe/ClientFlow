import { Lead } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LeadListProps {
  leads: Lead[]
}

export function LeadList({ leads }: LeadListProps) {
  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <Card key={lead.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {lead.first_name} {lead.last_name}
            </CardTitle>
            <div className={cn(
              "px-2 py-1 rounded text-xs font-semibold",
              lead.priority === 'high' ? "bg-red-100 text-red-700" :
              lead.priority === 'medium' ? "bg-yellow-100 text-yellow-700" :
              "bg-green-100 text-green-700"
            )}>
              {lead.priority}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{lead.company}</p>
            <p className="text-sm font-bold mt-2">{lead.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Mock cn for this file since I can't import it easily in this thought block without making sure it's there
import { cn } from "@/lib/utils"
