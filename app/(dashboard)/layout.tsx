"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { Loader2, Info } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isInitialLoading } = useAuth()

  if (isInitialLoading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  const isDemo = (user as any).isDemo

  return (
    <div className="h-full relative bg-background">
      {isDemo && (
        <div className="bg-primary text-primary-foreground py-2.5 px-6 flex items-center justify-center gap-3 text-xs font-semibold tracking-wide sticky top-0 z-[100] shadow-sm">
          <Info className="w-3.5 h-3.5" />
          <span>You are currently in Demo Mode. Data is prefilled for exploration. Changes you make will persist in this environment.</span>
          <button 
            onClick={() => {
              localStorage.removeItem("user")
              window.location.href = "/"
            }}
            className="ml-4 px-3 py-1 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            Exit Demo
          </button>
        </div>
      )}
      <div className="hidden h-full md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar />
      </div>
      <main className="md:pl-80 min-h-screen">
        {children}
      </main>
    </div>
  )
}
