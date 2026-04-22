import { prisma } from '~~/server/utils/db'
import { getUserIdFromEvent, getUserLevel, getUserLevelEmoji } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Utilisateur non trouvé',
    })
  }

  const checkinCount = await prisma.checkin.count({ where: { userId } })
  const uniqueRestaurants = await prisma.checkin.groupBy({
    by: ['restaurantId'],
    where: { userId },
  })
  const tamponCount = await prisma.userTampon.count({ where: { userId } })
  const histoireCount = await prisma.userHistoire.count({ where: { userId } })

  const level = getUserLevel(checkinCount)
  const emoji = getUserLevelEmoji(level)

  return {
    ...user,
    stats: {
      checkins: checkinCount,
      uniqueRestaurants: uniqueRestaurants.length,
      tampons: tamponCount,
      histoires: histoireCount,
      level: {
        name: level,
        emoji,
      },
    },
  }
})
