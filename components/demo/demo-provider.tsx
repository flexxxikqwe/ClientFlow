"use client"

import React from "react"
import { UserContext } from "@/features/auth/context/user-context"
import { DEMO_USER } from "@/lib/demo-data"

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const demoValue = {
    user: DEMO_USER,
    isLoading: false,
    isDemo: true,
    updatePlan: async () => {},
    refreshUser: async () => DEMO_USER,
    logout: async () => {
      window.location.href = "/"
    },
  }

  return (
    <UserContext.Provider value={demoValue}>
      {children}
    </UserContext.Provider>
  )
}
