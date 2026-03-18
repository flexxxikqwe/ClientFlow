"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user")
      return storedUser ? JSON.parse(storedUser) : null
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      // If no user and not on auth pages, redirect to login
      if (!pathname.startsWith("/login") && !pathname.startsWith("/register") && pathname !== "/") {
        router.push("/login")
      }
    }
  }, [router, pathname, user])

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return { user, isLoading, logout }
}
