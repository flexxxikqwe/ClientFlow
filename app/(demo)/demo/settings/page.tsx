import { AvatarUpload } from "@/components/settings/avatar-upload"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { PreferenceSettings } from "@/components/settings/preference-settings"
import { WorkspaceSettings } from "@/components/settings/workspace-settings"
import { AccountActions } from "@/components/settings/account-actions"
import { Sparkles } from "lucide-react"

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <AvatarUpload />
        </div>

        <div className="lg:col-span-2 space-y-10">
          <ProfileSettings />
          <PreferenceSettings />
          <WorkspaceSettings />
          <AccountActions />
        </div>
      </div>
      
      <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Most settings are simulated in Demo Mode. Create a real account to persist your changes.
        </p>
      </div>
    </div>
  )
}
