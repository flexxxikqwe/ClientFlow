"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "../context/user-context"

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, refreshUser, logout: contextLogout } = useUser()
  const hasAttemptedRef = useRef(false)

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isLandingPage = pathname === "/"
  const isDashboardPage = !isAuthPage && !isLandingPage

  useEffect(() => {
    // Don't do anything while the initial user check is in progress
    if (isLoading) return

    if (user) {
      // If logged in and on auth page, redirect to dashboard
      if (isAuthPage) {
        router.push("/dashboard")
      }
    } else if (isDashboardPage) {
      // If no user on a dashboard page, try one-time bootstrap/refresh
      // This handles the case where cookies might not be immediately available in iframes
      if (!hasAttemptedRef.current) {
        hasAttemptedRef.current = true
        const timer = setTimeout(() => {
          refreshUser()
        }, 500)
        return () => clearTimeout(timer)
      } else {
        // If still no user after one retry, redirect to login
        router.push("/login")
      }
    }
  }, [user, isLoading, pathname, refreshUser, router, isAuthPage, isDashboardPage])

  const logout = async () => {
    await contextLogout()
    router.push("/login")
  }

  return { user, isLoading, logout }
}
