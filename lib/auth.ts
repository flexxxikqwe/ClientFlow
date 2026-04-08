import { cookies } from 'next/headers'
import { usersRepository } from './db'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'clientflow_secret_fallback_123'
)

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  
  if (!token) return null
  
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.sub as string
    
    const user = await usersRepository.getUserById(userId)
    if (!user) return null
    
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    return null
  }
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  const isProd = process.env.NODE_ENV === 'production'
  
  cookieStore.set('session_token', token, {
    httpOnly: true,
    // Secure must be true for sameSite: 'none'
    // On localhost, we disable secure to avoid issues with non-HTTPS setups
    secure: isProd, 
    // 'none' is required for cross-site iframes (AI Studio preview)
    // 'lax' is better for standard development and security
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session_token')
}
