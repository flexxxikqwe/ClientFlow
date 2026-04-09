"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "../context/user-context"

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, isInitialLoading, logout: contextLogout } = useUser()

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isOnboardingPage = pathname.startsWith("/onboarding")
  const isLandingPage = pathname === "/"
  const isProtectedPage = !isAuthPage && !isLandingPage

  useEffect(() => {
    // Don't do anything while the initial user check is in progress
    if (isInitialLoading) return

    if (user) {
      // If logged in and on auth page, redirect to dashboard
      if (isAuthPage && !isOnboardingPage) {
        router.push("/dashboard")
      }
    } else if (isProtectedPage) {
      // If no user on a protected page after initial check, redirect to login
      if (!isOnboardingPage) {
        router.push("/login")
      } else {
        console.warn("Onboarding session not found, waiting for stability...")
      }
    }
  }, [user, isInitialLoading, pathname, router, isAuthPage, isProtectedPage, isOnboardingPage])

  const logout = async () => {
    await contextLogout()
    router.push("/login")
  }

  return { user, isLoading, isInitialLoading, logout }
}
