"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Sparkles,
  Menu,
  X
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { useUser } from "@/features/auth/context/user-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogoutButton } from "@/components/auth/logout-button"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [lastPathname, setLastPathname] = useState(pathname)
  const { user, isDemo } = useUser()

  // Close menu when pathname changes (handled during render)
  if (pathname !== lastPathname) {
    setIsOpen(false)
    setLastPathname(pathname)
  }

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const basePath = isDemo && pathname.startsWith("/demo") ? "/demo" : "/dashboard"

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: basePath === "/demo" ? "/demo/dashboard" : "/dashboard",
    },
    {
      label: "Leads",
      icon: Users,
      href: basePath === "/demo" ? "/demo/leads" : "/dashboard/leads",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: basePath === "/demo" ? "/demo/analytics" : "/dashboard/analytics",
    },
  ]

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl bg-secondary/50 border border-border/50 text-foreground hover:bg-secondary transition-all"
        aria-label="Open Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[150]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-card border-r border-border/50 z-[160] flex flex-col shadow-2xl"
            >
              <div className="p-8 flex items-center justify-between border-b border-border/30">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground tracking-tight leading-none">
                      ClientFlow
                    </span>
                    <span className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.3em] mt-1">CRM</span>
                  </div>
                </Link>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <p className="px-4 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.3em] mb-6 mt-4">Main Menu</p>
                {routes.map((route) => {
                  const isActive = pathname === route.href
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "group flex items-center gap-4 px-4 py-4 text-sm font-semibold rounded-xl transition-all duration-300",
                        isActive 
                          ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" 
                          : "hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                        isActive ? "bg-primary/10" : "bg-transparent group-hover:bg-secondary/50"
                      )}>
                        <route.icon className={cn(
                          "h-4 w-4 transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground/50 group-hover:text-foreground"
                        )} />
                      </div>
                      {route.label}
                    </Link>
                  )
                })}
              </div>

              <div className="p-8 border-t border-border/30 space-y-6">
                {user && (
                  <div className="flex items-center gap-4 px-2">
                    <Avatar className="h-10 w-10 border-2 border-border/50">
                      <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                      <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                        {user.full_name?.[0] || user.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground truncate leading-tight">
                          {user.full_name || user.email}
                        </span>
                        {user.isDemo && (
                          <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">
                            Demo
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] truncate mt-0.5">{user.role || "Admin"}</span>
                    </div>
                  </div>
                )}
                <div className="pt-2">
                  <LogoutButton />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
