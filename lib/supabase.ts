import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Explicit flag to check if Supabase is configured.
 * This is used by the repository factory to decide whether to use Supabase or JSON fallback.
 */
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey

// Only initialize the client if configured to avoid runtime errors on startup
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any) // Type cast to satisfy existing imports, but it shouldn't be called if !isSupabaseConfigured
