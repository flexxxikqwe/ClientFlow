import { getUserByEmail, createUser } from '@/lib/db'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { email, password, fullName } = await request.json()
  
  const existingUser = getUserByEmail(email)
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }

  const user = createUser({
    email,
    password,
    full_name: fullName,
    role: 'user'
  })

  // Set a simple session cookie
  const cookieStore = await cookies()
  cookieStore.set('session_user_id', user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })

  const { password: _, ...userWithoutPassword } = user
  return NextResponse.json({ 
    message: 'Registration successful',
    user: userWithoutPassword
  })
}
