export interface Lead {
  id: string
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  company: string | null
  status: string
  stage_id: string | null
  owner_id: string | null
  priority?: 'low' | 'medium' | 'high'
  value: number | null
  source: string | null
  message?: string | null
  owner?: { id: string; full_name: string; avatar_url: string | null } | null
  stage?: { id: string; name: string } | null
  notes?: LeadNote[]
}

export interface LeadNote {
  id: string
  created_at: string
  lead_id: string
  author_id: string
  content: string
  author?: { full_name: string | null } | null
}
