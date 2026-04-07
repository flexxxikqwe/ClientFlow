"use client"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-900">
      {children}
    </div>
  )
}
