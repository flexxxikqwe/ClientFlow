"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

interface UserContextType {
  user: any | null
  isLoading: boolean
  isDemo: boolean
  updatePlan: (newPlan: string) => Promise<void>
  refreshUser: () => Promise<any>
  logout: () => Promise<void>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isDemo = !!user?.isDemo

  const refreshUser = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/me")
      const data = await response.json()
      setUser(data.user)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      } else {
        localStorage.removeItem("user")
      }
      return data.user
    } catch (error) {
      console.error("Failed to refresh user", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    async function initAuth() {
      try {
        const response = await fetch("/api/auth/me")
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
          localStorage.setItem("user", JSON.stringify(data.user))
        } else {
          setUser(null)
          localStorage.removeItem("user")
        }
      } catch (error) {
        console.error("Failed to fetch user", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      localStorage.removeItem("user")
    } catch (error) {
      console.error("Failed to logout", error)
      throw error
    }
  }, [])

  const updatePlan = useCallback(async (newPlan: string) => {
    if (!user) return
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
      })
      const updatedUser = await response.json()
      if (updatedUser && !updatedUser.error) {
        setUser(updatedUser)
      }
    } catch (error) {
      console.error("Failed to update plan", error)
    }
  }, [user])

  return (
    <UserContext.Provider value={{ user, isLoading, isDemo, updatePlan, refreshUser, logout }}>
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
