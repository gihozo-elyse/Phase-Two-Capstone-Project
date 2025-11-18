import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface JWTPayload {
  userId: string
  email: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function getTokenFromRequest(
  headers: Headers | Record<string, string | string[] | undefined>
): string | null {
  let authHeader: string | null = null;
  
  if (headers instanceof Headers) {
    authHeader = headers.get('authorization');
  } else if (typeof headers.authorization === 'string') {
    authHeader = headers.authorization;
  } else if (Array.isArray(headers.authorization)) {
    authHeader = headers.authorization[0];
  }
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

