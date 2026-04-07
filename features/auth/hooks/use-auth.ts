"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "../context/user-context"

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, logout: contextLogout } = useUser()

  useEffect(() => {
    if (!isLoading && !user) {
      // If no user and not on auth pages, redirect to login
      const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
      const isLandingPage = pathname === "/"
      
      if (!isAuthPage && !isLandingPage) {
        router.push("/login")
      }
    }
  }, [router, pathname, user, isLoading])

  const logout = async () => {
    await contextLogout()
    router.push("/login")
  }

  return { user, isLoading, logout }
}
