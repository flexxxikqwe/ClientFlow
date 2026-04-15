import { usersRepository } from '@/lib/db'
import { NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()
    
    const existingUser = await usersRepository.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await usersRepository.createUser({
      email,
      password: hashedPassword,
      full_name: fullName,
      role: 'user'
    })

    await createSession(user.id)

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ 
      message: 'Registration successful',
      user: userWithoutPassword
    })
  } catch (error: unknown) {
    console.error('Registration Error:', error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
