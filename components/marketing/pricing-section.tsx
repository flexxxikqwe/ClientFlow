"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const handlePlanChange = (plan: string) => {
    router.push(`/register?plan=${plan}`)
  }

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 29,
      yearlyPrice: 24,
      features: ["Up to 3 users", "Basic lead tracking", "Email support", "5GB storage"]
    },
    {
      name: "Professional",
      monthlyPrice: 79,
      yearlyPrice: 69,
      popular: true,
      features: ["Up to 10 users", "Advanced analytics", "Priority support", "25GB storage", "Custom stages"]
    },
    {
      name: "Enterprise",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      features: ["Unlimited users", "Full API access", "Dedicated manager", "Unlimited storage", "SAML SSO"]
    }
  ]

  return (
    <section id="pricing" className="py-32">
      <div className="container px-8 mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Pricing</p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your team&apos;s needs.</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-16">
          <div className="relative p-1 bg-secondary/30 rounded-full flex items-center border border-border/50" role="group" aria-label="Billing cycle toggle">
            <motion.div
              className="absolute h-[calc(100%-8px)] bg-background rounded-full shadow-sm border border-border/50"
              initial={false}
              animate={{
                width: billingCycle === "monthly" ? "100px" : "120px",
                x: billingCycle === "monthly" ? 4 : 104,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setBillingCycle("monthly")}
              aria-pressed={billingCycle === "monthly"}
              className={cn(
                "relative z-10 px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              aria-pressed={billingCycle === "yearly"}
              className={cn(
                "relative z-10 px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Yearly <span className="text-[8px] text-primary ml-1" aria-label="Save 20 percent on yearly billing">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={cn(
                "p-10 rounded-[2rem] border transition-all duration-500 flex flex-col group relative overflow-hidden",
                plan.popular 
                  ? "border-primary/50 shadow-2xl shadow-primary/10 bg-card scale-105 z-10" 
                  : "border-border/50 bg-card/80 hover:border-primary/30 shadow-xl shadow-black/5 dark:shadow-white/5"
              )}
            >
              {plan.popular && (
                <>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                    Most Popular
                  </div>
                </>
              )}
              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{plan.name}</h3>
                <div className="flex items-baseline gap-1 overflow-hidden h-12" aria-live="polite" aria-atomic="true">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={billingCycle}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-baseline gap-1"
                    >
                      <span className="text-4xl font-black tracking-tighter">
                        {plan.monthlyPrice === "Custom" ? "Custom" : (billingCycle === "monthly" ? `$${plan.monthlyPrice}` : `$${plan.yearlyPrice}`)}
                      </span>
                      {typeof plan.monthlyPrice === "number" && (
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">/mo</span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <ul className="space-y-5 mb-12 flex-1">
                {plan.features.map((feature, j) => (
                   <li key={j} className="flex items-center gap-3 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                size="lg"
                variant={plan.popular ? "default" : "secondary"}
                className={cn(
                  "w-full h-14 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer",
                  plan.popular 
                    ? "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]" 
                    : "bg-secondary/50 hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98]"
                )}
                onClick={() => handlePlanChange(plan.name)}
              >
                Choose {plan.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
