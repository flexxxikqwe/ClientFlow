"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const leadFormSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type LeadFormValues = z.infer<typeof leadFormSchema>

export function LeadForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  })

  async function onSubmit(values: LeadFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit")
      }

      toast.success("Thank you! We'll be in touch soon.")
      form.reset()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-xl mx-auto border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight">Get Started with ClientFlow</CardTitle>
        <CardDescription className="text-sm font-medium text-muted-foreground">
          Fill out the form below and our team will get back to you within 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label htmlFor="first_name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">First Name</Label>
              <Input id="first_name" placeholder="John" className="h-12 bg-background/50" disabled={isLoading} {...form.register("first_name")} />
              {form.formState.errors.first_name && (
                <p className="text-[10px] font-semibold text-destructive ml-1">{form.formState.errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="last_name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Last Name</Label>
              <Input id="last_name" placeholder="Doe" className="h-12 bg-background/50" disabled={isLoading} {...form.register("last_name")} />
              {form.formState.errors.last_name && (
                <p className="text-[10px] font-semibold text-destructive ml-1">{form.formState.errors.last_name.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Work Email</Label>
            <Input id="email" type="email" placeholder="john@company.com" className="h-12 bg-background/50" disabled={isLoading} {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-[10px] font-semibold text-destructive ml-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Phone Number (Optional)</Label>
              <Input id="phone" placeholder="+1 (555) 000-0000" className="h-12 bg-background/50" disabled={isLoading} {...form.register("phone")} />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="company" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Company Name (Optional)</Label>
              <Input id="company" placeholder="Acme Inc." className="h-12 bg-background/50" disabled={isLoading} {...form.register("company")} />
            </div>
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">How can we help?</Label>
            <Textarea 
              id="message" 
              placeholder="Tell us about your team and CRM needs..." 
              className="min-h-[140px] bg-background/50 resize-none"
              disabled={isLoading} 
              {...form.register("message")} 
            />
            {form.formState.errors.message && (
              <p className="text-[10px] font-semibold text-destructive ml-1">{form.formState.errors.message.message}</p>
            )}
          </div>
          <Button type="submit" size="lg" className="w-full h-14 text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
