"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { MobileNav } from "./mobile-nav"

export function MobileHeader() {
  return (
    <header className="md:hidden flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border/30 sticky top-[45px] z-[90]">
      <Link href="/dashboard" className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground tracking-tight leading-none">
            ClientFlow
          </span>
          <span className="text-[8px] font-bold text-primary/60 uppercase tracking-[0.3em] mt-0.5">CRM</span>
        </div>
      </Link>
      
      <MobileNav />
    </header>
  )
}
