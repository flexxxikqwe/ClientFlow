import { AvatarUpload } from "@/components/settings/avatar-upload"
import { Sparkles, Shield, Bell, CreditCard } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-primary mb-2">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Account Settings</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your profile, preferences, and account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                <h3 className="font-bold text-foreground">Security</h3>
                <p className="text-xs text-muted-foreground">Manage your password and authentication methods.</p>
              </div>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-sky-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Notifications</h3>
                <p className="text-xs text-muted-foreground">Configure how you receive alerts and updates.</p>
              </div>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Billing</h3>
                <p className="text-xs text-muted-foreground">Manage your subscription and payment history.</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-bold text-foreground">Professional Plan</h4>
              <p className="text-xs text-muted-foreground">Your next billing date is May 15, 2026.</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              Manage Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
