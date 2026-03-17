"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) throw new Error("Logout failed")

      toast.success("Logged out successfully")
      router.push("/login")
      router.refresh()
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
      onClick={handleLogout}
    >
      <LogOut className="h-5 w-5 mr-3" />
      Logout
    </Button>
  )
}
