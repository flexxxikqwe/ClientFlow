"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Bell, Moon, Send, ShieldCheck } from "lucide-react"
import { useTheme } from "next-themes"

export function PreferenceSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    telegramNotifications: false,
  })

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const handleToggle = (key: keyof typeof prefs) => {
    const newVal = !prefs[key]
    setPrefs({ ...prefs, [key]: newVal })
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    toast.success(`${label} ${newVal ? 'enabled' : 'disabled'}`)
  }

  if (!mounted) {
    return (
      <div className="p-8 rounded-3xl bg-card/30 border border-border/50 backdrop-blur-sm space-y-8 animate-pulse">
        <div className="h-12 w-48 bg-secondary/20 rounded-xl" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-secondary/10 rounded-2xl border border-border/10" />
          ))}
        </div>
      </div>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className="p-8 rounded-3xl bg-card/30 border border-border/50 backdrop-blur-sm space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-violet-500" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Preferences</h3>
          <p className="text-sm text-muted-foreground font-medium">Personalize your interaction and delivery methods.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Workspace Appearance Section */}
        <section className="space-y-4">
          <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Appearance</h4>
          <div 
            onClick={() => {
              const nextTheme = isDark ? "light" : "dark"
              setTheme(nextTheme)
              toast.success(`Theme updated to ${nextTheme} mode`)
            }}
            className="flex items-center justify-between p-5 rounded-2xl bg-secondary/10 border border-border/20 transition-all hover:bg-secondary/20 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center transition-colors group-hover:bg-indigo-500/20">
                <Moon className="h-5 w-5 text-indigo-500" aria-hidden="true" />
              </div>
              <div className="grid gap-1">
                <Label className="font-bold text-foreground cursor-pointer pointer-events-none">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Switch between high-contrast dark and clean light themes.</p>
              </div>
            </div>
            <Switch 
              checked={isDark} 
              onCheckedChange={() => {}} // Controlled via row click
              className="pointer-events-none"
              aria-label="Dark Mode Toggle"
            />
          </div>
        </section>

        {/* Channels Section */}
        <section className="space-y-4">
          <div className="px-4 flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Communication Channels</h4>
            <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest italic">Mock Integration Mode</span>
          </div>

          <div className="space-y-4">
            <div 
              onClick={() => handleToggle('emailNotifications')}
              className="flex items-center justify-between p-5 rounded-2xl bg-secondary/10 border border-border/20 transition-all hover:bg-secondary/20 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center transition-colors group-hover:bg-sky-500/20">
                  <Bell className="h-5 w-5 text-sky-500" aria-hidden="true" />
                </div>
                <div className="grid gap-1">
                  <Label className="font-bold text-foreground cursor-pointer pointer-events-none">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Get real-time alerts about new leads and activity.</p>
                </div>
              </div>
              <Switch 
                checked={prefs.emailNotifications} 
                onCheckedChange={() => {}} 
                className="pointer-events-none"
                aria-label="Toggle Email Notifications"
              />
            </div>

            <div 
              onClick={() => handleToggle('telegramNotifications')}
              className="flex items-center justify-between p-5 rounded-2xl bg-secondary/10 border border-border/20 transition-all hover:bg-secondary/20 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center transition-colors group-hover:bg-blue-500/20">
                  <Send className="h-5 w-5 text-blue-500" aria-hidden="true" />
                </div>
                <div className="grid gap-1">
                  <Label className="font-bold text-foreground cursor-pointer pointer-events-none">Telegram Notifications</Label>
                  <p className="text-xs text-muted-foreground">Connect your Telegram account for instant pipeline updates.</p>
                </div>
              </div>
              <Switch 
                checked={prefs.telegramNotifications} 
                onCheckedChange={() => {}} 
                className="pointer-events-none"
                aria-label="Toggle Telegram Notifications"
              />
            </div>
          </div>
          <p className="px-4 text-[10px] font-medium text-muted-foreground/50 leading-relaxed italic">
            * Delivery integration can be fully connected in the production environment settings.
          </p>
        </section>
      </div>
    </div>
  )
}
