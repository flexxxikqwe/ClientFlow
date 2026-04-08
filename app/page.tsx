"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, BarChart3, Users, Zap, ShieldCheck, Globe, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LeadForm } from "@/components/marketing/lead-form"
import { MarketingHeader } from "@/components/marketing/header"
import { useUser } from "@/features/auth/context/user-context"
import { toast } from "sonner"

export default function HomePage() {
  const router = useRouter()

  const handlePlanChange = (plan: string) => {
    toast.success(`You've selected the ${plan} plan!`)
    router.push("/register")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      <MarketingHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        <div className="container px-8 mx-auto relative z-10 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-4 duration-1000">
              <Sparkles className="h-3 w-3" />
              The Future of CRM is Here
            </div>
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
              The CRM built for <br />
              <span className="text-primary">modern teams</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Streamline your sales pipeline, automate lead tracking, and close more deals with the world&apos;s most intuitive CRM platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Button size="lg" className="rounded-full px-10 h-14 text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/20 group" asChild>
                <Link href="/register" className="flex items-center gap-2">
                  Get Started Free <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-10 h-14 text-sm font-bold uppercase tracking-widest border-border/50 hover:bg-secondary/50"
                asChild
              >
                <Link href="/demo/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 border-t border-border/50">
        <div className="container px-8 mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Features</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Everything you need to scale</h2>
            <p className="text-lg text-muted-foreground">Powerful features designed to help your sales team perform at their best every single day.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Get deep insights into your sales performance with real-time dashboards and custom reporting."
              },
              {
                icon: Users,
                title: "Lead Management",
                description: "Organize and track every lead from initial contact to closed deal with automated workflows."
              },
              {
                icon: Zap,
                title: "Smart Automation",
                description: "Automate repetitive tasks and follow-ups so your team can focus on building relationships."
              },
              {
                icon: ShieldCheck,
                title: "Enterprise Security",
                description: "Your data is protected with bank-grade encryption and SOC2 Type II compliance."
              },
              {
                icon: Globe,
                title: "Global Sync",
                description: "Collaborate with your team across time zones with instant data synchronization."
              },
              {
                icon: CheckCircle2,
                title: "Easy Integration",
                description: "Connect with your favorite tools like Slack, Gmail, and Zoom in just a few clicks."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/50 hover:border-primary/30 transition-all duration-500">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-secondary/20 border-y border-border/50">
        <div className="container px-8 mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2 space-y-12">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Workflow</p>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">How ClientFlow works</h2>
              </div>
              <div className="space-y-10">
                {[
                  {
                    step: "01",
                    title: "Capture Leads",
                    description: "Import leads from any source automatically or add them manually with ease."
                  },
                  {
                    step: "02",
                    title: "Organize Pipeline",
                    description: "Drag and drop leads through your custom sales stages to track progress visually."
                  },
                  {
                    step: "03",
                    title: "Close Deals",
                    description: "Use AI-powered insights to prioritize the right opportunities and close faster."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="text-5xl font-black text-primary/10 group-hover:text-primary/20 transition-colors duration-500 leading-none">{item.step}</div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                      <p className="text-muted-foreground font-medium leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative p-2 rounded-[2.5rem] bg-gradient-to-b from-border/50 to-transparent border border-border/50 shadow-2xl">
                <div className="aspect-video bg-card rounded-[2rem] flex items-center justify-center overflow-hidden">
                  <BarChart3 className="w-24 h-24 text-primary/10 animate-pulse" />
                  {/* Decorative elements to simulate a dashboard */}
                  <div className="absolute top-12 left-12 w-32 h-4 bg-primary/10 rounded-full" />
                  <div className="absolute top-20 left-12 w-24 h-4 bg-primary/5 rounded-full" />
                  <div className="absolute bottom-12 right-12 w-48 h-32 bg-primary/5 rounded-2xl border border-primary/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32">
        <div className="container px-8 mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Pricing</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground">Choose the plan that fits your team&apos;s needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$29",
                features: ["Up to 3 users", "Basic lead tracking", "Email support", "5GB storage"]
              },
              {
                name: "Professional",
                price: "$79",
                popular: true,
                features: ["Up to 10 users", "Advanced analytics", "Priority support", "25GB storage", "Custom stages"]
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: ["Unlimited users", "Full API access", "Dedicated manager", "Unlimited storage", "SAML SSO"]
              }
            ].map((plan, i) => (
              <div key={i} className={cn(
                "p-10 rounded-[2rem] border transition-all duration-500 flex flex-col",
                plan.popular 
                  ? "border-primary shadow-2xl shadow-primary/10 relative bg-card scale-105 z-10" 
                  : "border-border/50 bg-card/30 hover:bg-card/50"
              )}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <div className="space-y-2 mb-8">
                  <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">/mo</span>
                  </div>
                </div>
                <ul className="space-y-5 mb-12 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  size="lg"
                  variant={plan.popular ? "default" : "outline"}
                  className={cn(
                    "w-full h-14 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em]",
                    plan.popular ? "shadow-lg shadow-primary/20" : "border-border/50"
                  )}
                  onClick={() => handlePlanChange(plan.name)}
                >
                  Choose {plan.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section id="contact" className="py-32 bg-secondary/20 border-t border-border/50">
        <div className="container px-8 mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Contact</p>
                <h2 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">Ready to transform <br /> your sales?</h2>
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  Join over 2,000+ companies using ClientFlow to grow their business. Our team is ready to help you set up your perfect pipeline.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-bold text-foreground">Free 14-day trial, no credit card required</span>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-bold text-foreground">Setup in less than 5 minutes</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-background border-t border-border/50">
        <div className="container px-8 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">ClientFlow</span>
            </Link>
            <div className="flex gap-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
              © 2026 ClientFlow Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
