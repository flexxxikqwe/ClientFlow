"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { DemoProvider } from "@/components/demo/demo-provider"
import { Info } from "lucide-react"

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DemoProvider>
      <div className="h-full relative bg-background">
        <div className="bg-amber-500 text-white py-2.5 px-6 flex items-center justify-center gap-3 text-xs font-semibold tracking-wide sticky top-0 z-[100] shadow-sm">
          <Info className="w-3.5 h-3.5" />
          <span>PORTFOLIO DEMO MODE: This is a stable preview with seeded data. No real account is required.</span>
          <button 
            onClick={() => {
              window.location.href = "/"
            }}
            className="ml-4 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            Exit Demo
          </button>
        </div>
        <div className="hidden h-full md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-[80]">
          <Sidebar />
        </div>
        <main className="md:pl-80 min-h-screen">
          {children}
        </main>
      </div>
    </DemoProvider>
  )
}
