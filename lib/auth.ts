import { cookies } from 'next/headers'
import { usersRepository } from './db'
import { SignJWT, jwtVerify } from 'jose'

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    // For a portfolio project, we provide a fallback even in production 
    // to prevent the app from crashing if the user hasn't set up secrets yet.
    // We log a warning so the developer knows to fix it.
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ JWT_SECRET is missing. Using a fallback secret. This is insecure for production use.')
    }
    return new TextEncoder().encode('clientflow_production_fallback_secret_32_chars_min_secure')
  }
  return new TextEncoder().encode(secret)
}

const JWT_SECRET_VAL = getJwtSecret()

function getActiveSecret() {
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
  
  // AI Studio and Vercel both use HTTPS. 
  // 'sameSite: none' is REQUIRED for cookies to work in the AI Studio iframe.
  // 'none' requires 'secure: true'.
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: true, 
    sameSite: 'none',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session_token')
}
