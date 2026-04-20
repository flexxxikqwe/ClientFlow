import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Lead } from "@/types/leads"
import { UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"

interface LeadInfoTabProps {
  form: UseFormReturn<any>
  isEditing: boolean
  users: { id: string, full_name: string }[]
  isLoading: boolean
  onUpdate: () => void
  lead: Lead
}

export function LeadInfoTab({ 
  form,
  isEditing, 
  users, 
  isLoading, 
  onUpdate,
  lead 
}: LeadInfoTabProps) {
  const { register, formState: { errors }, watch, setValue } = form
  const statusValue = watch("status")
  const ownerValue = watch("owner_id")

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Status</Label>
          <Select 
            disabled={!isEditing} 
            value={statusValue} 
            onValueChange={(v) => setValue("status", v, { shouldValidate: true })}
          >
            <SelectTrigger className={cn(
              "h-11 bg-secondary/10 border-border/50 transition-all",
              errors.status && "border-destructive/50 ring-destructive/20"
            )}>
              <SelectValue />
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
            <p className="text-[10px] font-bold text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.status.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Assigned Manager</Label>
          <Select 
            disabled={!isEditing} 
            value={ownerValue || "unassigned"} 
            onValueChange={(v) => setValue("owner_id", v === "unassigned" ? null : v, { shouldValidate: true })}
          >
            <SelectTrigger className="h-11 bg-secondary/10 border-border/50 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-xl bg-card/95 border-border/50">
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map(u => (
                <SelectItem key={u.id} value={u.id}>{u.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Value ($)</Label>
            <Input 
              type="number" 
              disabled={!isEditing} 
              {...register("value", { valueAsNumber: true })}
              className={cn(
                "h-11 bg-secondary/10 border-border/50 focus:ring-primary/20 transition-all",
                errors.value && "border-destructive/50 focus:ring-destructive/20"
              )}
            />
            {errors.value && (
              <p className="text-[10px] font-bold text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.value.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Source</Label>
            <Input value={lead.source || "Unknown"} disabled className="h-11 bg-secondary/5 border-border/30 opacity-50" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Email</Label>
          <div className="relative group/field">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors" />
            <Input 
              disabled={!isEditing} 
              {...register("email")}
              className={cn(
                "h-11 pl-10 bg-secondary/10 border-border/50 focus:ring-primary/20 transition-all",
                errors.email && "border-destructive/50 focus:ring-destructive/20"
              )}
            />
          </div>
          {errors.email && (
            <p className="text-[10px] font-bold text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.email.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Phone</Label>
          <div className="relative group/field">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors" />
            <Input 
              disabled={!isEditing} 
              {...register("phone")}
              className={cn(
                "h-11 pl-10 bg-secondary/10 border-border/50 focus:ring-primary/20 transition-all",
                errors.phone && "border-destructive/50 focus:ring-destructive/20"
              )}
            />
          </div>
          {errors.phone && (
            <p className="text-[10px] font-bold text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.phone.message as string}
            </p>
          )}
        </div>
      </div>

      {isEditing && (
        <Button 
          className="w-full mt-6 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]" 
          onClick={onUpdate} 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      )}
    </div>
  )
}
