"use client"

import { useState, useEffect } from "react"
import { Sparkles, X, ArrowRight, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { useUser } from "@/features/auth/context/user-context"
import { cn } from "@/lib/utils"

export function PortfolioNotice() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, isLoading: isUserLoading } = useUser()
  const pathname = usePathname()
  const [systemTheme, setSystemTheme] = useState<"light" | "dark" | "unknown">("unknown")
  const [mounted, setMounted] = useState(false)

  // Visibility rules: Hide in demo mode or for authenticated users
  const isDemoRoute = pathname.startsWith("/demo")
  const shouldHideNotice = isUserLoading || !!user || isDemoRoute

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("portfolio-notice-dismissed")
    
    // Initial entrance delay
    const timer = setTimeout(() => {
      setIsVisible(true)
      setIsMinimized(isDismissed === "true")
      const timer2 = setTimeout(() => setMounted(true), 0)
      return () => clearTimeout(timer2)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      
      const timer = setTimeout(() => {
        setSystemTheme(mediaQuery.matches ? "dark" : "light")
      }, 0)
      
      const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? "dark" : "light")
      mediaQuery.addEventListener("change", handler)
      return () => {
        clearTimeout(timer)
        mediaQuery.removeEventListener("change", handler)
      }
    }
  }, [])

  const handleDismiss = () => {
    setIsMinimized(true)
    sessionStorage.setItem("portfolio-notice-dismissed", "true")
  }

  const handleExpand = () => {
    setIsMinimized(false)
    sessionStorage.setItem("portfolio-notice-dismissed", "false")
  }

  const handleThemeSwitch = (targetTheme: string) => {
    setTheme(targetTheme)
    toast.success(`Switched to ${targetTheme} theme!`, {
      description: "You can change it back anytime in Settings (Demo or App).",
      duration: 5000,
    })
  }

  if (shouldHideNotice || !mounted) return null

  const suggestedTheme = systemTheme === "unknown" ? "dark" : systemTheme
  const otherTheme = theme === "dark" ? "light" : "dark"
  const isSystemMatch = theme === suggestedTheme

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        isMinimized ? (
          <motion.button
            key="minimized"
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            onClick={handleExpand}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl bg-card/80 backdrop-blur-xl border border-primary/20 shadow-xl shadow-primary/10 flex items-center justify-center group hover:border-primary/40 hover:scale-110 transition-all duration-300"
            title="Open Portfolio Preview Info"
          >
            <Sparkles className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse border-2 border-background" />
          </motion.button>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
          >
            <div className="relative p-6 rounded-[1.5rem] bg-card/80 backdrop-blur-xl border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
              
              <button 
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary/50 text-muted-foreground/40 hover:text-foreground transition-colors"
                title="Minimize"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Portfolio Preview</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-foreground tracking-tight">Welcome to ClientFlow</h4>
                  <p className="text-xs font-medium text-muted-foreground/80 leading-relaxed">
                    This is a portfolio showcase. The best way to explore the platform features is via the 
                    <span className="text-foreground font-bold"> Live Demo</span>. 
                  </p>
                </div>

                {/* Theme Suggestion Section */}
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {theme === "light" ? (
                        <Moon className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Sun className="h-3.5 w-3.5 text-primary" />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                        Theme Selection
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground/70 leading-relaxed">
                    {!isSystemMatch 
                      ? `Your device prefers ${suggestedTheme} mode. Want to try it?`
                      : `You are in ${theme} mode. Swap anytime below or in the sidebar.`
                    }
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleThemeSwitch(otherTheme)}
                    className="w-full h-8 rounded-xl text-[10px] font-bold uppercase tracking-widest border-primary/20 hover:bg-primary/10 hover:border-primary/30 text-primary transition-all"
                  >
                    Switch to {otherTheme} mode
                  </Button>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button 
                    asChild 
                    size="sm" 
                    className="flex-1 rounded-full h-9 px-5 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    <Link href="/demo/dashboard" className="flex items-center gap-2">
                      Explore Demo <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDismiss}
                    className="rounded-full h-9 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-foreground"
                  >
                    Minimize
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )
      )}
    </AnimatePresence>
  )
}
