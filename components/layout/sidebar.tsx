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
import { useUser } from "@/features/auth/context/user-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Leads",
    icon: Users,
    href: "/dashboard/leads",
    color: "text-violet-500",
  },
  {
    label: "Pipeline",
    icon: Kanban,
    href: "/dashboard/pipeline",
    color: "text-pink-700",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    color: "text-orange-700",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <div className="flex flex-col h-full bg-card/20 backdrop-blur-xl text-muted-foreground border-r border-border/30">
      <div className="px-10 py-16 flex-1">
        <Link href="/dashboard" className="flex items-center gap-4 mb-20 group transition-all duration-500">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground tracking-tight leading-none">
              ClientFlow
            </h1>
            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.3em] mt-1">CRM</span>
          </div>
        </Link>
        
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.3em] mb-8">Main Menu</p>
          {routes.map((route) => {
            const isActive = pathname === route.href
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "group flex items-center gap-4 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" 
                    : "hover:bg-secondary/30 hover:text-foreground"
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
      </div>

      <div className="p-10 mt-auto">
        <div className="space-y-8">
          {user && (
            <div className="flex items-center gap-4 px-2 group cursor-pointer">
              <Avatar className="h-10 w-10 border-2 border-border/50 transition-all group-hover:border-primary/50">
                <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                  {user.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-foreground truncate leading-tight group-hover:text-primary transition-colors">{user.full_name}</span>
                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] truncate mt-0.5">{user.role || "Admin"}</span>
              </div>
            </div>
          )}
          <div className="pt-8 border-t border-border/30">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}
