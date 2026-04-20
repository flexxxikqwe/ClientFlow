"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoutButton } from "@/components/auth/logout-button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { useUser } from "@/features/auth/context/user-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Sidebar() {
  const pathname = usePathname()
  const { user, isDemo: isUserDemo } = useUser()

  const isDemoPath = pathname.startsWith("/demo")
  const basePath = isDemoPath ? "/demo" : "/dashboard"

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: isDemoPath ? "/demo/dashboard" : "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Leads",
      icon: Users,
      href: isDemoPath ? "/demo/leads" : "/dashboard/leads",
      color: "text-violet-500",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: isDemoPath ? "/demo/analytics" : "/dashboard/analytics",
      color: "text-orange-700",
    },
    {
      label: "Settings",
      icon: Settings,
      href: isDemoPath ? "/demo/settings" : "/dashboard/settings",
      color: "text-gray-500",
    },
  ]

  return (
    <nav className="flex flex-col h-full bg-card/20 backdrop-blur-xl text-muted-foreground border-r border-border/30" aria-label="Main Navigation">
      <div className="px-10 py-16 flex-1">
        <div className="flex items-center justify-between mb-20">
          <Link href="/dashboard" className="flex items-center gap-4 group transition-all duration-500" aria-label="ClientFlow CRM - Go to Dashboard">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Sparkles className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground tracking-tight leading-none">
                ClientFlow
              </span>
              <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.3em] mt-1">CRM</span>
            </div>
          </Link>
          <ThemeToggle />
        </div>
        
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.3em] mb-8">Main Menu</p>
          <ul className="space-y-2">
            {routes.map((route) => {
              const isActive = pathname === route.href
              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={cn(
                      "group flex items-center gap-4 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300",
                      isActive 
                        ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" 
                        : "hover:bg-secondary/30 hover:text-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                      isActive ? "bg-primary/10" : "bg-transparent group-hover:bg-secondary/50"
                    )}>
                      <route.icon className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground/50 group-hover:text-foreground"
                      )} aria-hidden="true" />
                    </div>
                    {route.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="p-10 mt-auto">
        <div className="space-y-8">
          {user ? (
            <div className="flex items-center gap-4 px-2 group cursor-pointer">
              <Avatar className="h-10 w-10 border-2 border-border/50 transition-all group-hover:border-primary/50">
                <AvatarImage src={user.avatar_url || `https://avatar.vercel.sh/${user.email}`} />
                <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                  {user.full_name?.[0] || user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground truncate leading-tight group-hover:text-primary transition-colors">
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
          ) : isDemoPath ? (
            <div className="flex items-center gap-4 px-2 group">
              <Avatar className="h-10 w-10 border-2 border-border/50">
                <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                  D
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground truncate leading-tight">
                    Demo User
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">
                    Guest
                  </span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] truncate mt-0.5">Showcase Access</span>
              </div>
            </div>
          ) : null}
          <div className="pt-8 border-t border-border/30">
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
