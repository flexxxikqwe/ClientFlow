"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface UserContextType {
  user: any | null
  isLoading: boolean
  isDemo: boolean
  updatePlan: (newPlan: string) => Promise<void>
  refreshUser: () => Promise<any>
  loginAsDemo: () => Promise<any>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isDemo = !!user?.isDemo

  useEffect(() => {
    async function initAuth() {
      try {
        // Small delay to allow cookies to settle in iframe environments
        await new Promise(resolve => setTimeout(resolve, 100))
        
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
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [])

  const refreshUser = async () => {
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
  }

  const loginAsDemo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/demo", { method: "POST" })
      const data = await response.json()
      if (data.user) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        return data.user
      }
      throw new Error(data.error || "Demo login failed")
    } catch (error) {
      console.error("Failed to login as demo", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      localStorage.removeItem("user")
    } catch (error) {
      console.error("Failed to logout", error)
      throw error
    }
  }

  const updatePlan = async (newPlan: string) => {
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
