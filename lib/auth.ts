import { cookies } from 'next/headers'
import { getUserById } from './db'

export async function getSessionUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('session_user_id')?.value
  
  if (!userId) return null
  
  const user = getUserById(userId)
  if (!user) return null
  
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
