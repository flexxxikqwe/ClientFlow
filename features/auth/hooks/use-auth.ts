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
      // We explicitly check if we're NOT already on or heading to an onboarding page
      if (isAuthPage && !isOnboardingPage) {
        router.push("/dashboard")
      }
    } else if (isProtectedPage) {
      // If no user on a protected page, attempt a one-time session bootstrap.
      // We use a small delay to allow cross-site cookies to stabilize in preview/iframe environments.
      if (!hasAttemptedRef.current) {
        hasAttemptedRef.current = true
        const bootstrapTimer = setTimeout(() => {
          refreshUser().then((refreshedUser) => {
            // Only redirect to login if the bootstrap definitively failed to find a user
            if (!refreshedUser) {
              router.push("/login")
            }
          })
        }, 600)
        return () => clearTimeout(bootstrapTimer)
      }
      // Note: We removed the aggressive 'else' redirect here to prevent 
      // race conditions during transitional routes like onboarding.
    }
  }, [user, isLoading, pathname, refreshUser, router, isAuthPage, isProtectedPage, isOnboardingPage])

  const logout = async () => {
    await contextLogout()
    router.push("/login")
  }

  return { user, isLoading, logout }
}
