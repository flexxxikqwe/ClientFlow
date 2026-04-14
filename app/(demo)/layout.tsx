"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { DemoProvider } from "@/components/demo/demo-provider"
import { Info, Sparkles } from "lucide-react"

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DemoProvider>
      <div className="h-full relative bg-background">
        <div className="bg-zinc-900 text-white py-3 px-6 flex items-center justify-between gap-3 text-xs font-medium sticky top-0 z-[100] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              Showcase
            </div>
            <span className="text-zinc-400 font-bold uppercase tracking-[0.1em] hidden sm:inline">Portfolio Demo Mode:</span>
            <span className="text-zinc-100 truncate">Exploring ClientFlow with pre-seeded data.</span>
          </div>
          <button 
            onClick={() => {
              window.location.href = "/"
            }}
            className="px-3 sm:px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-bold text-[10px] uppercase tracking-widest shrink-0"
          >
            Exit Demo
          </button>
        </div>

        <MobileHeader />

        <div className="hidden h-full md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-[80]">
          <Sidebar />
        </div>
        <main className="md:pl-80 min-h-screen">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </DemoProvider>
  )
}
