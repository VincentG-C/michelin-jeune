import { prisma } from '~~/server/utils/db'
import { getUserIdFromEvent } from '~~/server/utils/auth'
import {
  computePasseportPlacement,
  getDistanceInMeters,
  getTamponColor,
} from '~~/server/utils/checkin'

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

  const tampon = await prisma.tampon.upsert({
    where: { restaurantId },
    update: {},
    create: {
      restaurantId,
      imageUrl: null,
      color: getTamponColor(restaurant.michelinType, restaurant.isEco),
    },
    include: {
      restaurant: true,
    },
  })

  const existingTamponCount = await prisma.userTampon.count({ where: { userId } })
  const placement = computePasseportPlacement(existingTamponCount)

  const collectedTampon = await prisma.userTampon.create({
    data: {
      userId,
      tamponId: tampon.id,
      pageNumber: placement.pageNumber,
      positionX: placement.positionX,
      positionY: placement.positionY,
      collectedAt: checkin.checkedAt,
    },
    include: {
      tampon: {
        include: {
          restaurant: true,
        },
      },
    },
  })

  const totalTampons = existingTamponCount + 1
  const eligibleRecompenses = await prisma.recompense.findMany({
    where: { tamponRequired: { lte: totalTampons } },
    orderBy: { tamponRequired: 'asc' },
  })

  const alreadyUnlocked = await prisma.userRecompense.findMany({
    where: {
      userId,
      recompenseId: { in: eligibleRecompenses.map((reward) => reward.id) },
    },
    select: { recompenseId: true },
  })

  const unlockedRewardIds = new Set(alreadyUnlocked.map((reward) => reward.recompenseId))
  const rewardsToUnlock = eligibleRecompenses.filter((reward) => !unlockedRewardIds.has(reward.id))
  const newRecompenses = []

  for (const reward of rewardsToUnlock) {
    const unlocked = await prisma.userRecompense.create({
      data: {
        userId,
        recompenseId: reward.id,
      },
      include: { recompense: true },
    })

    newRecompenses.push(unlocked)
  }

  const latestRecompense = newRecompenses[newRecompenses.length - 1] ?? null

  return {
    checkin,
    distance: Math.round(distance),
    nouveauTampon: {
      id: collectedTampon.id,
      tamponId: collectedTampon.tamponId,
      restaurantId: collectedTampon.tampon.restaurantId,
      restaurantName: collectedTampon.tampon.restaurant.name,
      imageUrl: collectedTampon.tampon.imageUrl,
      color: collectedTampon.tampon.color,
      pageNumber: collectedTampon.pageNumber,
      positionX: collectedTampon.positionX,
      positionY: collectedTampon.positionY,
      collectedAt: collectedTampon.collectedAt,
    },
    recompense: latestRecompense
      ? {
          id: latestRecompense.recompense.id,
          tamponRequired: latestRecompense.recompense.tamponRequired,
          titre: latestRecompense.recompense.titre,
          description: latestRecompense.recompense.description,
          unlockedAt: latestRecompense.unlockedAt,
          isUsed: latestRecompense.isUsed,
        }
      : null,
  }
})
