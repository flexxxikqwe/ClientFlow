"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "../context/user-context"

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, refreshUser, logout: contextLogout } = useUser()
  const isResolvingSessionRef = useRef(false)

  useEffect(() => {
    if (!isLoading && !isResolvingSessionRef.current) {
      const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
      const isLandingPage = pathname === "/"
      
      if (user) {
        // If logged in and on auth page, redirect to dashboard
        if (isAuthPage) {
          router.replace("/dashboard")
        }
      } else {
        // If no user and not on auth/landing pages, redirect to login
        if (!isAuthPage && !isLandingPage) {
          isResolvingSessionRef.current = true
          refreshUser()
            .then((resolvedUser) => {
              if (!resolvedUser) {
                router.replace("/login")
              }
            })
            .finally(() => {
              isResolvingSessionRef.current = false
            })
        }
      }
    }
  }, [router, pathname, user, isLoading, refreshUser])

  const logout = async () => {
    await contextLogout()
    router.push("/login")
  }

  return { user, isLoading, logout }
}
