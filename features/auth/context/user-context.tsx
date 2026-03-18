"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { LocalStore } from "@/lib/store"
import { DEMO_USER } from "@/lib/mock-data"

interface UserContextType {
  user: any | null
  isLoading: boolean
  isDemo: boolean
  updatePlan: (newPlan: string) => Promise<void>
  refreshUser: () => void
  loginAsDemo: () => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(() => {
    if (typeof window !== "undefined") {
      return LocalStore.getUser()
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)

  const isDemo = !!user?.isDemo

  const refreshUser = () => {
    const storedUser = LocalStore.getUser()
    setUser(storedUser)
  }

  const loginAsDemo = () => {
    setUser(DEMO_USER)
    LocalStore.setUser(DEMO_USER)
  }

  const logout = () => {
    setUser(null)
    LocalStore.clearUser()
  }

  const updatePlan = async (newPlan: string) => {
    if (!user) return
    const updatedUser = { ...user, plan: newPlan }
    setUser(updatedUser)
    LocalStore.setUser(updatedUser)
  }

  return (
    <UserContext.Provider value={{ user, isLoading, isDemo, updatePlan, refreshUser, loginAsDemo, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
