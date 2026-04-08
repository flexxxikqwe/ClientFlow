"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { CheckCircle2, CreditCard, ShieldCheck, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

function BillingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)

  const plan = searchParams.get("plan") || "Professional"
  
  const planPrices: Record<string, string> = {
    "Starter": "29",
    "Professional": "79",
    "Enterprise": "Custom"
  }

  const price = planPrices[plan] || "79"

  const handleActivate = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success("Workspace activated! Welcome to ClientFlow.")
    router.push("/dashboard")
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="h-3 w-3" />
          Step 2: Activate Workspace
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Confirm your plan</h1>
        <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed">
          You&apos;ve selected the <span className="text-foreground font-bold">{plan} Plan</span>. 
          Complete this mock step to activate your full CRM dashboard.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        <div className="p-1 rounded-3xl bg-gradient-to-b from-border/50 to-transparent">
          <div className="p-8 rounded-[1.4rem] bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl shadow-primary/5 space-y-8">
            
            {/* Plan Summary */}
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Selected Plan</p>
                <p className="text-lg font-bold">{plan} Plan</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black">{price === "Custom" ? "Custom" : `$${price}`}{price !== "Custom" && <span className="text-xs font-bold text-muted-foreground">/mo</span>}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">14-Day Free Trial</p>
              </div>
            </div>

            {/* Mock Payment Form */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                <CreditCard className="h-4 w-4" />
                Mock Payment Method
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Card Number</Label>
                  <Input 
                    disabled 
                    value="•••• •••• •••• 4242" 
                    className="h-12 bg-secondary/10 border-border/50 rounded-xl font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Expiry</Label>
                    <Input 
                      disabled 
                      value="12 / 28" 
                      className="h-12 bg-secondary/10 border-border/50 rounded-xl font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">CVC</Label>
                    <Input 
                      disabled 
                      value="***" 
                      className="h-12 bg-secondary/10 border-border/50 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0" />
                <p className="text-[10px] font-medium text-amber-500/80 leading-relaxed">
                  This is a <span className="font-bold">demo environment</span>. No real payment will be processed. 
                  Clicking activate will grant you full access to the dashboard.
                </p>
              </div>
            </div>

            <Button 
              onClick={handleActivate}
              disabled={isProcessing}
              className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activating Workspace...
                </>
              ) : (
                <>
                  Activate Workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
          Secure Checkout Powered by ClientFlow Demo
        </p>
      </div>
    </div>
  )
}

export default function MockBillingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12"><Sparkles className="h-8 w-8 animate-pulse text-primary/20" /></div>}>
      <BillingContent />
    </Suspense>
  )
}
