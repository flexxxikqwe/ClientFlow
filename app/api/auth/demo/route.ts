import { createSession } from '@/lib/auth'
import { usersRepository } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST() {
  const demoUser = await usersRepository.getUserById('demo-user')
  if (!demoUser) {
    return NextResponse.json({ error: 'Demo user not found' }, { status: 404 })
  }

  await createSession(demoUser.id)
  
  const { password: _, ...userWithoutPassword } = demoUser
  return NextResponse.json({ 
    message: 'Demo login successful',
    user: userWithoutPassword
  })
}
