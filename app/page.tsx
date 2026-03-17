import Link from "next/link"
import { CheckCircle2, BarChart3, Users, Zap, ArrowRight, ShieldCheck, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LeadForm } from "@/components/marketing/lead-form"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-950 text-white">
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              The CRM built for <span className="text-sky-500">modern teams</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Streamline your sales pipeline, automate lead tracking, and close more deals with the world&apos;s most intuitive CRM platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8 h-12 text-lg" asChild>
                <Link href="#contact">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-900 px-8 h-12 text-lg">
                View Demo
              </Button>
            </div>
          </div>
        </div>
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-slate-500">Powerful features designed to help your sales team perform at their best every single day.</p>
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
              <div key={i} className="p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow bg-slate-50 dark:bg-slate-800/50">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-8">How ClientFlow works</h2>
              <div className="space-y-8">
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
                  <div key={i} className="flex gap-6">
                    <div className="text-4xl font-bold text-sky-500/20">{item.step}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-20 h-20 text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-slate-900">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-500">Choose the plan that fits your team&apos;s needs.</p>
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
                "p-8 rounded-3xl border transition-all hover:scale-105 duration-300",
                plan.popular ? "border-sky-500 shadow-xl relative bg-slate-50 dark:bg-slate-800" : "border-slate-200 dark:border-slate-800"
              )}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-lg font-normal text-slate-500">/mo</span></div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-5 h-5 text-sky-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className={cn("w-full h-12 text-lg", plan.popular ? "bg-sky-600 hover:bg-sky-700 text-white" : "variant-outline")} asChild>
                  <Link href="#contact">Choose Plan</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-6">Ready to transform your sales?</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 mb-8">
                Join over 2,000+ companies using ClientFlow to grow their business. Our team is ready to help you set up your perfect pipeline.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-sky-600" />
                  </div>
                  <span className="font-medium">Free 14-day trial, no credit card required</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-sky-600" />
                  </div>
                  <span className="font-medium">Setup in less than 5 minutes</span>
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
      <footer className="py-12 bg-slate-950 text-slate-400 border-t border-slate-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 text-white font-bold text-2xl">
              <Zap className="w-8 h-8 text-sky-500 fill-sky-500" />
              ClientFlow
            </div>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
            </div>
            <p className="text-sm">© 2026 ClientFlow Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
