import { Database } from "./supabase"

export type Lead = Database['public']['Tables']['leads']['Row'] & {
  owner?: { id: string; full_name: string; avatar_url: string | null } | null
  stage?: { id: string; name: string } | null
  notes?: (Database['public']['Tables']['lead_notes']['Row'] & { author?: { full_name: string | null } | null })[]
}
