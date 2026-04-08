"use client"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { Loader2, Sparkles } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* Left Side: Form Content */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 xl:p-24 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>

      {/* Right Side: Visual/Marketing Panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden bg-zinc-900 border-l border-border/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
        
        <div className="relative z-10 w-full flex flex-col justify-between p-16 xl:p-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ClientFlow</span>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight">
                Scale your sales <br />
                <span className="text-primary">without the friction.</span>
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed max-w-md">
                Join thousands of high-growth teams using ClientFlow to automate their pipeline and close deals faster.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">2,000+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Active Teams</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Uptime</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
              JD
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-300 leading-relaxed">
                &quot;ClientFlow transformed how we track leads. It&apos;s the most intuitive CRM we&apos;ve ever used.&quot;
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">John Doe, CEO at TechFlow</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
