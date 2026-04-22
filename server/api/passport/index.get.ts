import { prisma } from '~/server/utils/db'
import { getUserIdFromEvent, getUserLevel, getUserLevelEmoji } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)

  // Get all checkins with restaurant info
  const checkins = await prisma.checkin.findMany({
    where: { userId },
    include: { restaurant: true },
    orderBy: { checkedAt: 'desc' },
  })

  // Get unlocked tampons
  const tampons = await prisma.userTampon.findMany({
    where: { userId },
    include: { tampon: true },
    orderBy: { unlockedAt: 'desc' },
  })

  // Calculate level
  const checkinCount = checkins.length
  const level = getUserLevel(checkinCount)
  const emoji = getUserLevelEmoji(level)

  // Unique restaurants visited
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
      id: ut.tampon.id,
      name: ut.tampon.name,
      description: ut.tampon.description,
      icon: ut.tampon.icon,
      unlockedAt: ut.unlockedAt,
    })),
  }
})
