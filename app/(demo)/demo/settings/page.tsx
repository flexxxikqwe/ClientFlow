import { AvatarUpload } from "@/components/settings/avatar-upload"
import { Sparkles, Shield, Bell, CreditCard } from "lucide-react"

export default function DemoSettingsPage() {
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-primary mb-2">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Demo Mode</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground font-medium">This is a preview of the settings experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 opacity-80 pointer-events-none grayscale-[0.2]">
        <div className="lg:col-span-1">
          <AvatarUpload />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-3xl bg-card/30 border border-border/50 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-muted-foreground/50">Security</h3>
                <p className="text-xs text-muted-foreground/40">Manage your password and authentication methods.</p>
              </div>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-sky-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-muted-foreground/50">Notifications</h3>
                <p className="text-xs text-muted-foreground/40">Configure how you receive alerts and updates.</p>
              </div>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-muted-foreground/50">Billing</h3>
                <p className="text-xs text-muted-foreground/40">Manage your subscription and payment history.</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-bold text-foreground text-muted-foreground/50">Professional Plan</h4>
              <p className="text-xs text-muted-foreground/40">Your next billing date is May 15, 2026.</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-primary/20 text-primary/40 text-xs font-bold cursor-not-allowed">
              Manage Plan
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Settings are read-only in Demo Mode. Create a real account to customize your profile.
        </p>
      </div>
    </div>
  )
}
