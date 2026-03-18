import { getUserByEmail } from '@/lib/db'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  const user = getUserByEmail(email)

  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

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
    message: 'Login successful',
    user: userWithoutPassword
  })
}
