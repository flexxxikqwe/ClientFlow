"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/features/auth/context/user-context"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const { refreshUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Login failed")
      }

      await refreshUser()
      toast.success("Welcome back!")
      // Hard redirect to ensure session is stable and fresh
      window.location.href = "/dashboard"
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={isLoading}
            {...form.register("email")}
            className="h-12 bg-secondary/10 border-border/50 focus:ring-primary/20 rounded-xl transition-all"
            data-testid="email-input"
          />
          {form.formState.errors.email && (
            <p className="text-[10px] font-bold text-destructive uppercase tracking-wider ml-1">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" id="password-label" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Password</Label>
          <Input
            id="password"
            type="password"
            disabled={isLoading}
            {...form.register("password")}
            className="h-12 bg-secondary/10 border-border/50 focus:ring-primary/20 rounded-xl transition-all"
            data-testid="password-input"
          />
          {form.formState.errors.password && (
            <p className="text-[10px] font-bold text-destructive uppercase tracking-wider ml-1">{form.formState.errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading} data-testid="sign-in-button">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In to Account
        </Button>
      </form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/30" />
        </div>
        <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.3em]">
          <span className="bg-background px-4 text-muted-foreground/40">Quick Access</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full h-12 rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 text-primary font-bold text-[10px] uppercase tracking-[0.2em] transition-all group" 
        asChild
        disabled={isLoading}
        data-testid="demo-mode-button"
      >
        <Link href="/demo/dashboard" className="flex items-center justify-center gap-2">
          Explore as Guest (Demo)
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>
    </div>
  )
}
