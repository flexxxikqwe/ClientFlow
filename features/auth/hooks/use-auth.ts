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
  const isOnboardingPage = pathname.startsWith("/onboarding")
  const isLandingPage = pathname === "/"
  const isProtectedPage = !isAuthPage && !isLandingPage

  useEffect(() => {
    // Don't do anything while the initial user check is in progress
    if (isLoading) return

    if (user) {
      // If logged in and on auth page, redirect to dashboard
      // Note: We do NOT redirect to dashboard if on an onboarding page
      if (isAuthPage) {
        router.push("/dashboard")
      }
    } else if (isProtectedPage) {
      // If no user on a protected page (dashboard or onboarding), try one-time bootstrap/refresh
      if (!hasAttemptedRef.current) {
        hasAttemptedRef.current = true
        const timer = setTimeout(() => {
          refreshUser()
        }, 800) // Increased delay slightly for stability in iframes
        return () => clearTimeout(timer)
      } else {
        // If still no user after retry, redirect to login
        router.push("/login")
      }
    }
  }, [user, isLoading, pathname, refreshUser, router, isAuthPage, isProtectedPage])

  const logout = async () => {
    await contextLogout()
    router.push("/login")
  }

  return { user, isLoading, logout }
}
