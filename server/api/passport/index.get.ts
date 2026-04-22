import { prisma } from '~~/server/utils/db'
import { getUserIdFromEvent, getUserLevel, getUserLevelEmoji } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)

  const checkins = await prisma.checkin.findMany({
    where: { userId },
    include: { restaurant: true },
    orderBy: { checkedAt: 'desc' },
  })

  const tampons = await prisma.userTampon.findMany({
    where: { userId },
    include: {
      tampon: {
        include: {
          restaurant: true,
        },
      },
    },
    orderBy: { collectedAt: 'desc' },
  })

  const recompenses = await prisma.userRecompense.findMany({
    where: { userId },
    include: { recompense: true },
    orderBy: { unlockedAt: 'desc' },
  })

  const checkinCount = checkins.length
  const level = getUserLevel(checkinCount)
  const emoji = getUserLevelEmoji(level)

  const uniqueRestaurants = new Set(checkins.map((c) => c.restaurantId)).size

  return {
    level: {
      name: level,
      emoji,
      checkinCount,
      uniqueRestaurants,
    },
    checkins: checkins.map((c) => ({
      id: c.id,
      restaurant: c.restaurant,
      checkedAt: c.checkedAt,
    })),
    tampons: tampons.map((ut) => ({
      id: ut.id,
      tamponId: ut.tampon.id,
      restaurantId: ut.tampon.restaurantId,
      restaurantName: ut.tampon.restaurant.name,
      imageUrl: ut.tampon.imageUrl,
      color: ut.tampon.color,
      pageNumber: ut.pageNumber,
      positionX: ut.positionX,
      positionY: ut.positionY,
      collectedAt: ut.collectedAt,
    })),
    recompenses: recompenses.map((ur) => ({
      id: ur.recompense.id,
      tamponRequired: ur.recompense.tamponRequired,
      titre: ur.recompense.titre,
      description: ur.recompense.description,
      unlockedAt: ur.unlockedAt,
      isUsed: ur.isUsed,
    })),
  }
})
