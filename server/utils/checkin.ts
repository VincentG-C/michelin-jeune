import type { MichelinType } from '@prisma/client'
import { prisma } from '~~/server/utils/db'

const STAMPS_PER_PAGE = 4

const STAMP_POSITIONS = [
  { x: 25, y: 25 },
  { x: 75, y: 25 },
  { x: 25, y: 75 },
  { x: 75, y: 75 },
]

export function getDistanceInMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

export function getTamponColor(michelinType: MichelinType, isEco: boolean): string {
  if (michelinType === 'etoile_1' || michelinType === 'etoile_2' || michelinType === 'etoile_3') {
    return 'bordeaux'
  }

  if (michelinType === 'bib' || isEco) {
    return 'vert'
  }

  return 'bleu'
}

export function computePasseportPlacement(existingTamponCount: number): {
  pageNumber: number
  positionX: number
  positionY: number
} {
  const slotIndex = existingTamponCount % STAMPS_PER_PAGE
  const pageNumber = Math.floor(existingTamponCount / STAMPS_PER_PAGE) + 1
  const slot = STAMP_POSITIONS[slotIndex] ?? { x: 25, y: 25 }

  return {
    pageNumber,
    positionX: slot.x,
    positionY: slot.y,
  }
}

export type UnlockedChapitreReward = {
  id: number
  chapitreId: number
  chapitreTitre: string
  titre: string
  description: string
  unlockedAt: Date
  isUsed: boolean
}

export async function unlockChapitreRewardIfComplete(
  userId: number,
  chapitreId: number,
  chapitreTitre: string
): Promise<UnlockedChapitreReward | null> {
  const totalHistoiresInChapter = await prisma.histoire.count({
    where: { chapitreId },
  })

  if (totalHistoiresInChapter === 0) {
    return null
  }

  const unlockedHistoiresInChapter = await prisma.userHistoire.count({
    where: {
      userId,
      histoire: {
        chapitreId,
      },
    },
  })

  if (unlockedHistoiresInChapter < totalHistoiresInChapter) {
    return null
  }

  const chapitreRecompense = await prisma.recompense.findUnique({
    where: { chapitreId },
  })

  if (!chapitreRecompense) {
    return null
  }

  const existingUserReward = await prisma.userRecompense.findUnique({
    where: {
      userId_recompenseId: {
        userId,
        recompenseId: chapitreRecompense.id,
      },
    },
  })

  if (existingUserReward) {
    return null
  }

  const userReward = await prisma.userRecompense.create({
    data: {
      userId,
      recompenseId: chapitreRecompense.id,
    },
  })

  return {
    id: chapitreRecompense.id,
    chapitreId: chapitreRecompense.chapitreId,
    chapitreTitre,
    titre: chapitreRecompense.titre,
    description: chapitreRecompense.description,
    unlockedAt: userReward.unlockedAt,
    isUsed: userReward.isUsed,
  }
}
