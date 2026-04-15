"use client"

import { useUser } from "@/features/auth/context/user-context"
import { Button } from "@/components/ui/button"
import { CreditCard, Zap, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function WorkspaceSettings() {
  const { user } = useUser()
  const plan = user?.plan || "Professional"

  const handleManagePlan = () => {
    toast.info("Redirecting to billing portal...")
    setTimeout(() => {
      toast.success("Billing portal loaded (Mock)")
    }, 1000)
  }

  return (
    <div className="p-8 rounded-3xl bg-card/30 border border-border/50 backdrop-blur-sm space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
          <CreditCard className="h-6 w-6 text-orange-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Workspace & Plan</h3>
          <p className="text-sm text-muted-foreground font-medium">Manage your subscription and workspace details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Zap className="h-20 w-20 text-primary" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Current Plan</span>
            <h4 className="text-2xl font-bold text-foreground">{plan}</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Unlimited Leads
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> AI Insights Enabled
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Priority Support
            </div>
          </div>
          <Button 
            onClick={handleManagePlan}
            className="w-full rounded-xl h-11 font-bold text-[10px] uppercase tracking-[0.2em] mt-4"
          >
            Manage Subscription
          </Button>
        </div>

        <div className="p-6 rounded-2xl bg-secondary/10 border border-border/20 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h5 className="font-bold text-foreground">Billing History</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              View and download your past invoices for tax and accounting purposes.
            </p>
          </div>
          <Button variant="outline" className="w-full rounded-xl h-11 font-bold text-[10px] uppercase tracking-[0.2em] border-border/50">
            View Invoices
          </Button>
        </div>
      </div>
    </div>
  )
}
