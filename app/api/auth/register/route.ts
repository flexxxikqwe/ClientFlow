import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) throw authError

    if (authData.user) {
      // 2. Create profile in public.users table using admin client
      const adminClient = createAdminClient()
      const { error: profileError } = await adminClient
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
        })

      if (profileError) {
        console.error("Profile creation error:", profileError)
        // We don't throw here because the user is already created in Auth
      }
    }

    return NextResponse.json({ message: "Registration successful" })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
