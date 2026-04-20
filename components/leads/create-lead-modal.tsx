"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Loader2, AlertCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { safeJson } from "@/lib/utils/safe-json"
import { useUser } from "@/features/auth/context/user-context"
import { useDemoLeads } from "@/components/demo/demo-leads-context"
import { cn } from "@/lib/utils"

const leadSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "Too long"),
  last_name: z.string().min(1, "Last name is required").max(50, "Too long"),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string().max(20, "Phone too long").optional(),
  company: z.string().max(100, "Company name too long").optional(),
  value: z.string().refine((val) => !val || !isNaN(parseFloat(val)), {
    message: "Must be a valid number"
  }).optional(),
  status: z.string().min(1, "Status is required")
})

type LeadFormValues = z.infer<typeof leadSchema>

interface CreateLeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateLeadModal({ isOpen, onClose, onSuccess }: CreateLeadModalProps) {
  const { isDemo: isUserDemo } = useUser()
  const pathname = usePathname()
  const isDemoMode = isUserDemo || pathname.startsWith("/demo")
  const demoLeads = useDemoLeads()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      value: "",
      status: "new"
    }
  })

  const currentStatus = watch("status")

  const onSubmit = async (values: LeadFormValues) => {
    setIsSubmitting(true)

    try {
      const payload = {
        ...values,
        phone: values.phone || null,
        value: values.value ? parseFloat(values.value) : 0,
      }

      if (isDemoMode && demoLeads) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        demoLeads.addLead({
          ...payload,
          source: "Direct",
          priority: "medium",
          message: "Lead created during demo session.",
          owner_id: "demo-user-123",
          stage_id: "1"
        })
        
        toast.success("Lead created successfully (Demo Mode)")
      } else {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const data = await safeJson(response)
          throw new Error(data?.error || "Failed to create lead")
        }

        toast.success("Lead created successfully")
      }

      onSuccess()
      onClose()
      reset()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Create New Lead</DialogTitle>
          <DialogDescription className="text-muted-foreground/60">
            Add a new potential client to your sales pipeline.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="first_name"
                placeholder="John"
                {...register("first_name")}
                className={cn(
                  "h-11 bg-secondary/10 border-border/50 focus:ring-primary/20",
                  errors.first_name && "border-destructive/50 focus:ring-destructive/20"
                )}
                data-testid="first-name-input"
              />
              {errors.first_name && (
                <p className="text-[10px] font-bold text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" /> {errors.first_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="last_name"
                placeholder="Doe"
                {...register("last_name")}
                className={cn(
                  "h-11 bg-secondary/10 border-border/50 focus:ring-primary/20",
                  errors.last_name && "border-destructive/50 focus:ring-destructive/20"
                )}
                data-testid="last-name-input"
              />
              {errors.last_name && (
                <p className="text-[10px] font-bold text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" /> {errors.last_name.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className={cn(
                  "h-11 bg-secondary/10 border-border/50 focus:ring-primary/20",
                  errors.email && "border-destructive/50 focus:ring-destructive/20"
                )}
                data-testid="email-input"
              />
              {errors.email && (
                <p className="text-[10px] font-bold text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" /> {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register("phone")}
                className={cn(
                  "h-11 bg-secondary/10 border-border/50 focus:ring-primary/20",
                  errors.phone && "border-destructive/50 focus:ring-destructive/20"
                )}
                data-testid="phone-input"
              />
              {errors.phone && (
                <p className="text-[10px] font-bold text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" /> {errors.phone.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Company</Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              {...register("company")}
              className={cn(
                "h-11 bg-secondary/10 border-border/50 focus:ring-primary/20",
                errors.company && "border-destructive/50 focus:ring-destructive/20"
              )}
              data-testid="company-input"
            />
            {errors.company && (
              <p className="text-[10px] font-bold text-destructive flex items-center gap-1" role="alert">
                <AlertCircle className="h-3 w-3" aria-hidden="true" /> {errors.company.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Value ($)</Label>
              <Input
                id="value"
                type="number"
                min="0"
                step="0.01"
                placeholder="5000"
                {...register("value")}
                className={cn(
                  "h-11 bg-secondary/10 border-border/50 focus:ring-primary/20",
                  errors.value && "border-destructive/50 focus:ring-destructive/20"
                )}
                data-testid="value-input"
              />
              {errors.value && (
                <p className="text-[10px] font-bold text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" /> {errors.value.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Status</Label>
              <Select 
                value={currentStatus} 
                onValueChange={(val) => setValue("status", val, { shouldValidate: true })}
              >
                <SelectTrigger className={cn(
                  "h-11 bg-secondary/10 border-border/50",
                  errors.status && "border-destructive/50"
                )} data-testid="status-select">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl bg-card/95 border-border/50">
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-[10px] font-bold text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" /> {errors.status.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleClose}
              className="h-11 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
              data-testid="submit-lead-button"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create Lead"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
