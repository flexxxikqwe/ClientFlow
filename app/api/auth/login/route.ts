import { usersRepository } from '@/lib/db'
import { NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    const user = await usersRepository.getUserByEmail(email)

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    await createSession(user.id)

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ 
      message: 'Login successful',
      user: userWithoutPassword
    })
  } catch (error: unknown) {
    console.error('Login Error:', error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
