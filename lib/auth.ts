import { cookies } from 'next/headers'
import { usersRepository } from './db'
import { SignJWT, jwtVerify } from 'jose'

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      // We don't throw at the top level to avoid breaking the build process
      // if secrets are missing during the build phase.
      return null
    }
    return new TextEncoder().encode('clientflow_dev_fallback_secret_32_chars_min')
  }
  return new TextEncoder().encode(secret)
}

const JWT_SECRET_VAL = getJwtSecret()

function getActiveSecret() {
  if (!JWT_SECRET_VAL) {
    throw new Error('JWT_SECRET environment variable is required in production')
  }
  return JWT_SECRET_VAL
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  
  if (!token) return null
  
  try {
    const { payload } = await jwtVerify(token, getActiveSecret())
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
    .sign(getActiveSecret())

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
