"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Bell, Moon, Globe, ShieldCheck } from "lucide-react"
import { useTheme } from "next-themes"

export function PreferenceSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    marketingEmails: false,
    publicProfile: false,
  })

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const handleToggle = (key: keyof typeof prefs) => {
    const newVal = !prefs[key]
    setPrefs({ ...prefs, [key]: newVal })
    toast.success(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} updated`)
  }

  if (!mounted) return null

  return (
    <div className="p-8 rounded-3xl bg-card/30 border border-border/50 backdrop-blur-sm space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-violet-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Preferences</h3>
          <p className="text-sm text-muted-foreground font-medium">Customize your workspace experience and privacy.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/10 border border-border/20 transition-all hover:bg-secondary/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <Label className="font-bold text-foreground">Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive alerts about lead activity.</p>
            </div>
          </div>
          <Switch 
            checked={prefs.emailNotifications} 
            onCheckedChange={() => handleToggle('emailNotifications')} 
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/10 border border-border/20 transition-all hover:bg-secondary/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Moon className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <Label className="font-bold text-foreground">Dark Mode</Label>
              <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
            </div>
          </div>
          <Switch 
            checked={theme === "dark"} 
            onCheckedChange={(checked) => {
              setTheme(checked ? "dark" : "light")
              toast.success(`Theme updated to ${checked ? "dark" : "light"} mode`)
            }} 
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/10 border border-border/20 transition-all hover:bg-secondary/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <Label className="font-bold text-foreground">Public Profile</Label>
              <p className="text-xs text-muted-foreground">Allow others to see your business profile.</p>
            </div>
          </div>
          <Switch 
            checked={prefs.publicProfile} 
            onCheckedChange={() => handleToggle('publicProfile')} 
          />
        </div>
      </div>
    </div>
  )
}
