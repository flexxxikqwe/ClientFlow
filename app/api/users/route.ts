import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch users from the public profiles table (assuming it exists or using auth.users if permitted)
  // In many Supabase setups, we have a 'profiles' table that mirrors auth.users
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name')
    .order('full_name')

  if (error) {
    // Fallback: if users table doesn't exist, return the current user as an option
    return NextResponse.json([{ id: user.id, full_name: user.user_metadata.full_name || user.email }])
  }

  return NextResponse.json(data)
}
