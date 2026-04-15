"use client"

import { useState, useRef } from "react"
import { useUser } from "@/features/auth/context/user-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, User as UserIcon } from "lucide-react"
import { toast } from "sonner"

export function AvatarUpload() {
  const { user, refreshUser, isDemo } = useUser()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (isDemo) {
      toast.error("Avatar upload is disabled in demo mode")
      return
    }

    // Limit size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB")
      return
    }

    setIsUploading(true)
    try {
      const response = await fetch(`/api/user/avatar/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      })

      if (!response.ok) throw new Error("Upload failed")

      const blob = await response.json()
      toast.success("Avatar updated successfully")
      await refreshUser()
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload avatar")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-card/50 border border-border/50 backdrop-blur-sm">
      <div className="relative group">
        <Avatar className="h-32 w-32 border-4 border-primary/10 shadow-2xl transition-transform group-hover:scale-105 duration-500">
          <AvatarImage src={user?.avatar_url || `https://avatar.vercel.sh/${user?.email}`} />
          <AvatarFallback className="bg-secondary text-4xl font-bold">
            {user?.full_name?.[0] || <UserIcon className="h-12 w-12" />}
          </AvatarFallback>
        </Avatar>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full backdrop-blur-[2px] animate-in fade-in duration-300">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-xl font-bold text-foreground">Profile Picture</h3>
        <p className="text-sm text-muted-foreground max-w-[200px]">
          Upload a new avatar to personalize your account.
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleUpload}
        disabled={isUploading || isDemo}
      />

      <Button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading || isDemo}
        className="rounded-xl px-8 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </>
        )}
      </Button>
      
      {isDemo && (
        <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">
          Disabled in Demo Mode
        </p>
      )}
    </div>
  )
}
