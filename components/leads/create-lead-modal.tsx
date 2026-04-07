"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const leadSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email().nullable().optional().or(z.literal("")),
  phone: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  status: z.string().default("new"),
})

interface CreateLeadModalProps {
  onSuccess: () => void
  isOpen?: boolean
  onClose?: () => void
}

export function CreateLeadModal({ onSuccess, isOpen: externalIsOpen, onClose: externalOnClose }: CreateLeadModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = (val: boolean) => {
    if (externalOnClose && !val) {
      externalOnClose()
    } else {
      setInternalIsOpen(val)
    }
  }

  const form = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      status: "new",
    },
  })

  const onSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          stage_id: values.status // Map status to stage_id for pipeline
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create lead")
      }

      toast.success("Lead created successfully")
      onSuccess()
      setIsOpen(false)
      form.reset()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {externalIsOpen === undefined && (
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-10 px-6 shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl rounded-xl">
        <DialogHeader className="p-8 border-b border-border/50 bg-card/50">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">Create New Lead</DialogTitle>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">Enter the details of the new lead to add them to your pipeline.</p>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8 bg-transparent">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label htmlFor="first_name" className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">First Name</Label>
              <Input 
                id="first_name" 
                {...form.register("first_name")} 
                className="h-10 rounded-lg border-border/50 bg-background/50 focus-visible:ring-primary/20"
                placeholder="John"
              />
              {form.formState.errors.first_name && (
                <p className="text-[10px] font-semibold text-destructive uppercase tracking-widest mt-1 ml-1">{form.formState.errors.first_name.message as string}</p>
              )}
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="last_name" className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">Last Name</Label>
              <Input 
                id="last_name" 
                {...form.register("last_name")} 
                className="h-10 rounded-lg border-border/50 bg-background/50 focus-visible:ring-primary/20"
                placeholder="Doe"
              />
              {form.formState.errors.last_name && (
                <p className="text-[10px] font-semibold text-destructive uppercase tracking-widest mt-1 ml-1">{form.formState.errors.last_name.message as string}</p>
              )}
            </div>
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              {...form.register("email")} 
              className="h-10 rounded-lg border-border/50 bg-background/50 focus-visible:ring-primary/20"
              placeholder="john.doe@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-[10px] font-semibold text-destructive uppercase tracking-widest mt-1 ml-1">{form.formState.errors.email.message as string}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label htmlFor="phone" className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">Phone Number</Label>
              <Input 
                id="phone" 
                {...form.register("phone")} 
                className="h-10 rounded-lg border-border/50 bg-background/50 focus-visible:ring-primary/20"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="company" className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">Company Name</Label>
              <Input 
                id="company" 
                {...form.register("company")} 
                className="h-10 rounded-lg border-border/50 bg-background/50 focus-visible:ring-primary/20"
                placeholder="Acme Corp"
              />
            </div>
          </div>
          <div className="space-y-2.5">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">Initial Pipeline Stage</Label>
            <Select 
              value={form.watch("status")} 
              onValueChange={(val) => form.setValue("status", val)}
            >
              <SelectTrigger className="h-10 rounded-lg border-border/50 bg-background/50 focus:ring-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border/50 bg-card">
                <SelectItem value="new" className="rounded-md">New Lead</SelectItem>
                <SelectItem value="contacted" className="rounded-md">Contacted</SelectItem>
                <SelectItem value="qualified" className="rounded-md">Qualified</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              className="h-10 px-6 rounded-lg text-xs font-semibold uppercase tracking-widest"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-10 px-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs uppercase tracking-widest shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
