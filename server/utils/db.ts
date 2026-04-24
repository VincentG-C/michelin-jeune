import pkg from '@prisma/client'
const { PrismaClient } = pkg
import type { PrismaClient as PrismaClientType } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL || 'postgresql://admin:michelin2026@localhost:5432/michelin_pulse'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined
}

function createPrismaClient() {
  const pool = new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
