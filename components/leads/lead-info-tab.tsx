import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Lead } from "@/types/leads"

interface LeadInfoTabProps {
  formData: Partial<Lead>
  setFormData: (data: Partial<Lead>) => void
  isEditing: boolean
  users: { id: string, full_name: string }[]
  isLoading: boolean
  onUpdate: () => void
  lead: Lead
}

export function LeadInfoTab({ 
  formData, 
  setFormData, 
  isEditing, 
  users, 
  isLoading, 
  onUpdate,
  lead 
}: LeadInfoTabProps) {
  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select 
            disabled={!isEditing} 
            value={formData.status} 
            onValueChange={(v) => setFormData({...formData, status: v})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Assigned Manager</Label>
          <Select 
            disabled={!isEditing} 
            value={formData.owner_id || "unassigned"} 
            onValueChange={(v) => setFormData({...formData, owner_id: v === "unassigned" ? null : v})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map(u => (
                <SelectItem key={u.id} value={u.id}>{u.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Value ($)</Label>
            <Input 
              type="number" 
              disabled={!isEditing} 
              value={formData.value || ""} 
              onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <Label>Source</Label>
            <Input value={lead.source || "Unknown"} disabled />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Input 
              disabled={!isEditing} 
              value={formData.email || ""} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <Input 
              disabled={!isEditing} 
              value={formData.phone || ""} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>
      </div>

      {isEditing && (
        <Button className="w-full mt-6" onClick={onUpdate} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      )}
    </div>
  )
}
