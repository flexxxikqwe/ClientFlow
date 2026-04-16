"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"
import { useUser } from "@/features/auth/context/user-context"
import { safeJson } from "@/lib/utils/safe-json"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm({ plan = "Professional" }: { plan?: string }) {
  const router = useRouter()
  const { refreshUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await safeJson(response)
        
        if (data?.code === 'EMAIL_ALREADY_IN_USE') {
          form.setError("email", { 
            type: "manual", 
            message: "This email is already in use" 
          })
          return
        }

        throw new Error(data?.error || "Registration failed")
      }

      await refreshUser()
      toast.success("Account created! Welcome.")
      // Redirect to mock onboarding billing step with the selected plan
      router.push(`/onboarding/billing?plan=${plan}`)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            disabled={isLoading}
            {...form.register("fullName")}
            className="h-12 bg-secondary/10 border-border/50 focus:ring-primary/20 rounded-xl transition-all"
          />
          {form.formState.errors.fullName && (
            <p className="text-[10px] font-bold text-destructive uppercase tracking-wider ml-1">{form.formState.errors.fullName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={isLoading}
            {...form.register("email")}
            className="h-12 bg-secondary/10 border-border/50 focus:ring-primary/20 rounded-xl transition-all"
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
          />
          {form.formState.errors.password && (
            <p className="text-[10px] font-bold text-destructive uppercase tracking-wider ml-1">{form.formState.errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Your Account
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
      >
        <Link href="/demo/dashboard" className="flex items-center justify-center gap-2">
          Explore as Guest (Demo)
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>
    </div>
  )
}
