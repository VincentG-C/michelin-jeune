import { prisma } from './db'
import { getUserLevel } from './auth'

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

export async function checkAndUnlockTampons(userId: number): Promise<any[]> {
  const newUnlocks: any[] = []

  const checkins = await prisma.checkin.findMany({
    where: { userId },
    include: { restaurant: true },
  })

  const checkinCount = checkins.length

  const unlockedTamponIds = (
    await prisma.userTampon.findMany({
      where: { userId },
      select: { tamponId: true },
    })
  ).map((ut) => ut.tamponId)

  const lockedTampons = await prisma.tampon.findMany({
    where: { id: { notIn: unlockedTamponIds.length > 0 ? unlockedTamponIds : [0] } },
  })

  for (const tampon of lockedTampons) {
    const condition = JSON.parse(tampon.condition)
    let shouldUnlock = false

    switch (condition.type) {
      case 'checkin_count':
        shouldUnlock = checkinCount >= condition.value
        break

      case 'michelin_type':
        shouldUnlock = checkins.some(
          (c) => c.restaurant.michelinType === condition.value
        )
        break

      case 'hidden_gem':
        shouldUnlock = checkins.some((c) => c.restaurant.isHiddenGem)
        break

      case 'eco':
        shouldUnlock = checkins.some((c) => c.restaurant.isEco)
        break

      case 'bib_count': {
        const bibCount = checkins.filter(
          (c) => c.restaurant.michelinType === 'bib'
        ).length
        shouldUnlock = bibCount >= condition.value
        break
      }
    }

    if (shouldUnlock) {
      const userTampon = await prisma.userTampon.create({
        data: { userId, tamponId: tampon.id },
        include: { tampon: true },
      })
      newUnlocks.push(userTampon)
    }
  }

  return newUnlocks
}

export async function checkAndUnlockHistoires(userId: number): Promise<any[]> {
  const newUnlocks: any[] = []

  const checkins = await prisma.checkin.findMany({
    where: { userId },
    include: { restaurant: true },
  })

  const checkinCount = checkins.length
  const userLevel = getUserLevel(checkinCount)

  const unlockedHistoireIds = (
    await prisma.userHistoire.findMany({
      where: { userId },
      select: { histoireId: true },
    })
  ).map((uh) => uh.histoireId)

  const lockedHistoires = await prisma.histoire.findMany({
    where: { id: { notIn: unlockedHistoireIds.length > 0 ? unlockedHistoireIds : [0] } },
  })

  const levelOrder = ['Novice', 'Curieux', 'Découvreur', 'Connaisseur', 'Inspecteur', 'Grand Gastronome']

  for (const histoire of lockedHistoires) {
    const condition = JSON.parse(histoire.conditionUnlock)
    let shouldUnlock = false

    switch (condition.type) {
      case 'niveau': {
        const requiredIdx = levelOrder.indexOf(condition.value)
        const currentIdx = levelOrder.indexOf(userLevel)
        shouldUnlock = currentIdx >= requiredIdx
        break
      }

      case 'restaurant':
        shouldUnlock = checkins.some(
          (c) => c.restaurantId === condition.value
        )
        break

      case 'checkin_count':
        shouldUnlock = checkinCount >= condition.value
        break
    }

    if (shouldUnlock) {
      const userHistoire = await prisma.userHistoire.create({
        data: { userId, histoireId: histoire.id },
        include: { histoire: true },
      })
      newUnlocks.push(userHistoire)
    }
  }

  return newUnlocks
}
