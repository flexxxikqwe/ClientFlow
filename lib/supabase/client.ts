import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey)

// Lead CRUD Helpers
export const getLeads = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      owner:users(full_name, avatar_url),
      stage:pipeline_stages(name)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getLeadById = async (id: string) => {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      owner:users(*),
      stage:pipeline_stages(*),
      notes:lead_notes(*, author:users(full_name))
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export const createLead = async (lead: Database['public']['Tables']['leads']['Insert']) => {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateLead = async (id: string, updates: Database['public']['Tables']['leads']['Update']) => {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteLead = async (id: string) => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}
