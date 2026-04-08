"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "../context/user-context"

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, isInitialLoading, refreshUser, logout: contextLogout } = useUser()
  const hasAttemptedRef = useRef(false)
  const userRef = useRef(user)

  // Keep userRef in sync with the latest user state
  useEffect(() => {
    userRef.current = user
  }, [user])

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
      // If no user on a protected page, attempt a one-time session bootstrap.
      if (!hasAttemptedRef.current) {
        hasAttemptedRef.current = true
        const bootstrapTimer = setTimeout(() => {
          refreshUser().then((refreshedUser) => {
            // Only redirect to login if BOTH the bootstrap result is null 
            // AND the current user state is still null.
            if (!refreshedUser && !userRef.current) {
              if (!isOnboardingPage) {
                router.push("/login")
              } else {
                console.warn("Onboarding bootstrap failed, waiting for stability...")
              }
            }
          })
        }, 1000) // Increased slightly for stability
        return () => clearTimeout(bootstrapTimer)
      }
    }
  }, [user, isInitialLoading, pathname, refreshUser, router, isAuthPage, isProtectedPage, isOnboardingPage])

  const logout = async () => {
    await contextLogout()
    router.push("/login")
  }

  return { user, isLoading, isInitialLoading, logout }
}
