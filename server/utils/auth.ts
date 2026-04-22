import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'

const JWT_SECRET = process.env.JWT_SECRET || 'michelin_jwt_secret_hackathon_2026'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// ─── Password helpers ─────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ─── JWT helpers ──────────────────────────────────
export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): { userId: number } {
  return jwt.verify(token, JWT_SECRET) as { userId: number }
}

// ─── Auth middleware helper ───────────────────────
export function getUserIdFromEvent(event: H3Event): number {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token manquant ou invalide',
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyToken(token)
    return decoded.userId
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token expiré ou invalide',
    })
  }
}

// ─── Niveau utilisateur ───────────────────────────
export function getUserLevel(checkinCount: number): string {
  if (checkinCount > 50) return 'Grand Gastronome'
  if (checkinCount >= 26) return 'Inspecteur'
  if (checkinCount >= 11) return 'Connaisseur'
  if (checkinCount >= 4) return 'Découvreur'
  if (checkinCount >= 1) return 'Curieux'
  return 'Novice'
}

export function getUserLevelEmoji(level: string): string {
  const emojis: Record<string, string> = {
    'Novice': '🌱',
    'Curieux': '🍽️',
    'Découvreur': '⭐',
    'Connaisseur': '🔍',
    'Inspecteur': '👤',
    'Grand Gastronome': '🏆',
  }
  return emojis[level] || '🌱'
}
