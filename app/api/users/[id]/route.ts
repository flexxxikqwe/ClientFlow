import { getSessionUser } from '@/lib/auth'
import { usersRepository } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sessionUser = await getSessionUser()
    
    if (!sessionUser || sessionUser.id !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const updatedUser = await usersRepository.updateUser(id, body)
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
