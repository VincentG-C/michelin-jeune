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
  chapitreOrdre: number
  chapitreTitre: string
  titre: string
  description: string
  unlockedAt: Date
  isUsed: boolean
}

export type UnlockedCheckinHistoire = {
  id: number
  chapitreId: number
  chapitreOrdre: number
  chapitreTitre: string
  ordre: number
  restaurantId: number
  restaurantName: string
  titre: string
  contenu: string
  imageCarteUrl: string | null
  unlockedAt: Date
}

const CHAPITRE_REWARD_PRESETS: Record<number, { titre: string; description: string }> = {
  1: {
    titre: 'Dessert offert',
    description: 'Chapitre Les Origines complete : un dessert offert.',
  },
  2: {
    titre: 'Cocktail offert',
    description: 'Chapitre Les Inspecteurs complete : un cocktail offert.',
  },
  3: {
    titre: 'Coupon -75%',
    description: 'Chapitre Les Etoiles complete : un coupon de reduction de 75%.',
  },
}

export function getChapitreRewardContent(chapitreOrdre: number, chapitreTitre: string) {
  return (
    CHAPITRE_REWARD_PRESETS[chapitreOrdre] ?? {
      titre: `Recompense du chapitre ${chapitreOrdre}`,
      description: `Chapitre ${chapitreTitre} complete : recompense debloquee.`,
    }
  )
}

export async function unlockNextHistoireForCheckin(
  userId: number
): Promise<UnlockedCheckinHistoire | null> {
  const nextHistoire = await prisma.histoire.findFirst({
    where: {
      userHistoires: {
        none: { userId },
      },
    },
    include: {
      chapitre: true,
      restaurant: true,
    },
    orderBy: [{ chapitre: { ordre: 'asc' } }, { ordre: 'asc' }],
  })

  if (!nextHistoire) {
    return null
  }

  const unlockedHistoire = await prisma.userHistoire.create({
    data: {
      userId,
      histoireId: nextHistoire.id,
    },
  })

  return {
    id: nextHistoire.id,
    chapitreId: nextHistoire.chapitreId,
    chapitreOrdre: nextHistoire.chapitre.ordre,
    chapitreTitre: nextHistoire.chapitre.titre,
    ordre: nextHistoire.ordre,
    restaurantId: nextHistoire.restaurantId,
    restaurantName: nextHistoire.restaurant.name,
    titre: nextHistoire.titre,
    contenu: nextHistoire.contenu,
    imageCarteUrl: nextHistoire.imageCarteUrl,
    unlockedAt: unlockedHistoire.unlockedAt,
  }
}

export async function unlockChapitreRewardIfComplete(
  userId: number,
  chapitreId: number
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
    include: {
      chapitre: true,
    },
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

  const rewardContent = getChapitreRewardContent(
    chapitreRecompense.chapitre.ordre,
    chapitreRecompense.chapitre.titre
  )

  return {
    id: chapitreRecompense.id,
    chapitreId: chapitreRecompense.chapitreId,
    chapitreOrdre: chapitreRecompense.chapitre.ordre,
    chapitreTitre: chapitreRecompense.chapitre.titre,
    titre: rewardContent.titre,
    description: rewardContent.description,
    unlockedAt: userReward.unlockedAt,
    isUsed: userReward.isUsed,
  }
}
