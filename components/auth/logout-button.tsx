"use client"

import { usePathname, useRouter } from "next/navigation"
import { LogOut, DoorOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useUser } from "@/features/auth/context/user-context"

export function LogoutButton() {
  const router = useRouter()
  const pathname = usePathname()
  const { logout, isDemo, user } = useUser()
  const isDemoPath = pathname.startsWith("/demo")

  const handleLogout = async () => {
    try {
      if (user && !isDemo) {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
        })
        if (!response.ok) throw new Error("Logout failed")
      }

      await logout()
      if (user) {
        toast.success(isDemo ? "Demo session ended" : "Logged out successfully")
      }
      router.push("/")
      router.refresh()
    } catch (error) {
      toast.error("Failed to end session")
    }
  }

  const isExit = isDemo || isDemoPath

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-muted-foreground/50 hover:text-foreground hover:bg-secondary/50 group"
      onClick={handleLogout}
    >
      {isExit ? (
        <DoorOpen className="h-5 w-5 mr-3 group-hover:text-primary transition-colors" />
      ) : (
        <LogOut className="h-5 w-5 mr-3 group-hover:text-primary transition-colors" />
      )}
      {isExit ? "Exit Demo" : "Logout"}
    </Button>
  )
}
