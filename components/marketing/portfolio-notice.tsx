"use client"

import { useState, useEffect } from "react"
import { Sparkles, X, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"

export function PortfolioNotice() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("portfolio-notice-dismissed")
    if (!isDismissed) {
      // Small delay for better impact
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem("portfolio-notice-dismissed", "true")
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
        >
          <div className="relative p-6 rounded-[1.5rem] bg-card/80 backdrop-blur-xl border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
            
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary/50 text-muted-foreground/40 hover:text-foreground transition-colors"
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
                  This is a portfolio showcase. The best way to explore is through our 
                  <span className="text-foreground font-bold"> Live Demo</span>. 
                  Real account access requires registration.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button 
                  asChild 
                  size="sm" 
                  className="rounded-full h-9 px-5 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20"
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
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
