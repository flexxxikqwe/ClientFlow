"use client"

import { useState } from "react"
import { useUser } from "@/features/auth/context/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, User as UserIcon, Mail } from "lucide-react"

export function ProfileSettings() {
  const { user, refreshUser, isDemo } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isDemo) {
      toast.info("Showcase Mode: Profile updates are simulated in this preview.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: formData.full_name }),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      await refreshUser()
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(true)
      // Small delay for better UX feel
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  return (
    <div className="p-8 rounded-3xl bg-card/30 border border-border/50 backdrop-blur-sm space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <UserIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Personal Profile</h3>
          <p className="text-sm text-muted-foreground font-medium">Update your personal information and contact details.</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="h-12 bg-secondary/10 border-border/50 focus:ring-primary/20 rounded-xl transition-all"
              placeholder="Your Name"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Email Address</Label>
            <div className="relative">
              <Input
                id="email"
                value={formData.email}
                readOnly
                className="h-12 bg-secondary/5 border-border/30 text-muted-foreground/50 rounded-xl cursor-not-allowed pl-10"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
            </div>
            <p className="text-[10px] font-medium text-muted-foreground/40 ml-1 italic">Email cannot be changed in this version.</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={isLoading || formData.full_name === user?.full_name}
            className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
