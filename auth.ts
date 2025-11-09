import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
)

export interface SessionPayload {
  userId: string
  email: string
  expiresAt: Date
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createSession(userId: string, email: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await encrypt({ userId, email, expiresAt })

  cookies().set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function verifySession(): Promise<SessionPayload | null> {
  const cookie = cookies().get('session')?.value
  if (!cookie) return null

  try {
    const verified = await decrypt(cookie)
    return verified
  } catch (error) {
    return null
  }
}

export async function deleteSession() {
  cookies().delete('session')
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function decrypt(session: string): Promise<SessionPayload> {
  try {
    const { payload } = await jwtVerify(session, JWT_SECRET, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch (error) {
    throw new Error('Invalid session')
  }
}

export async function validateAdminCredentials(
  email: string,
  password: string
): Promise<{ id: string; email: string } | null> {
  // First try environment variables
  if (
    process.env.ADMIN_EMAIL &&
    process.env.ADMIN_PASSWORD &&
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return { id: 'env-admin', email }
  }

  // Then try database
  const adminUser = await prisma.adminUser.findUnique({
    where: { email },
  })

  if (!adminUser) return null

  const isValid = await verifyPassword(password, adminUser.passwordHash)
  if (!isValid) return null

  return { id: adminUser.id, email: adminUser.email }
}

export async function requireAuth() {
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}
