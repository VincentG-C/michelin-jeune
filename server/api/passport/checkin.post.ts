import { prisma } from '~~/server/utils/db'
import { getUserIdFromEvent } from '~~/server/utils/auth'
import { getDistanceInMeters, checkAndUnlockTampons, checkAndUnlockHistoires } from '~~/server/utils/checkin'

const CHECKIN_RADIUS_METERS = 200

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)
  const body = await readBody(event)

  if (!body.restaurant_id || body.lat === undefined || body.lng === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'restaurant_id, lat et lng sont requis',
    })
  }

  const restaurantId = parseInt(body.restaurant_id)

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  })

  if (!restaurant) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Restaurant non trouvé',
    })
  }

  const distance = getDistanceInMeters(
    body.lat, body.lng,
    restaurant.lat, restaurant.lng
  )

  if (distance > CHECKIN_RADIUS_METERS) {
    throw createError({
      statusCode: 403,
      statusMessage: `Vous êtes trop loin du restaurant (${Math.round(distance)}m). Rapprochez-vous à moins de ${CHECKIN_RADIUS_METERS}m.`,
    })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const existingCheckin = await prisma.checkin.findFirst({
    where: {
      userId,
      restaurantId,
      checkedAt: { gte: today, lt: tomorrow },
    },
  })

  if (existingCheckin) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Vous avez déjà fait un check-in dans ce restaurant aujourd\'hui',
    })
  }

  const checkin = await prisma.checkin.create({
    data: { userId, restaurantId },
    include: { restaurant: true },
  })

  const newTampons = await checkAndUnlockTampons(userId)
  const newHistoires = await checkAndUnlockHistoires(userId)

  return {
    checkin,
    distance: Math.round(distance),
    unlocks: {
      tampons: newTampons,
      histoires: newHistoires,
    },
  }
})
