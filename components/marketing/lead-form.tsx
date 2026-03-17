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
    <Card className="w-full max-w-xl mx-auto border-zinc-200 dark:border-zinc-800 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Get Started with ClientFlow</CardTitle>
        <CardDescription>
          Fill out the form below and our team will get back to you within 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" placeholder="John" disabled={isLoading} {...form.register("first_name")} />
              {form.formState.errors.first_name && (
                <p className="text-xs text-destructive">{form.formState.errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" placeholder="Doe" disabled={isLoading} {...form.register("last_name")} />
              {form.formState.errors.last_name && (
                <p className="text-xs text-destructive">{form.formState.errors.last_name.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input id="email" type="email" placeholder="john@company.com" disabled={isLoading} {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" placeholder="+1 (555) 000-0000" disabled={isLoading} {...form.register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name (Optional)</Label>
              <Input id="company" placeholder="Acme Inc." disabled={isLoading} {...form.register("company")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">How can we help?</Label>
            <Textarea 
              id="message" 
              placeholder="Tell us about your team and CRM needs..." 
              className="min-h-[120px]"
              disabled={isLoading} 
              {...form.register("message")} 
            />
            {form.formState.errors.message && (
              <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white" disabled={isLoading}>
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
