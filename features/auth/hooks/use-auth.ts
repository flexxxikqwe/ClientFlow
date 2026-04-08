"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "../context/user-context"

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, logout: contextLogout } = useUser()

  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
      const isLandingPage = pathname === "/"
      
      if (user) {
        // If logged in and on auth page, redirect to dashboard
        if (isAuthPage) {
          router.push("/dashboard")
        }
      } else {
        // If no user and not on auth/landing pages, redirect to login
        if (!isAuthPage && !isLandingPage) {
          // Add a small delay before bouncing to login to handle transient states
          // This prevents "bouncing" during initial auth settling
          const timer = setTimeout(() => {
            router.push("/login")
          }, 800)
          return () => clearTimeout(timer)
        }
      }
    }
  }, [router, pathname, user, isLoading])

  const logout = async () => {
    await contextLogout()
    router.push("/login")
  }

  return { user, isLoading, logout }
}
