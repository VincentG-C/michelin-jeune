import { prisma } from '~~/server/utils/db'
import { getUserIdFromEvent } from '~~/server/utils/auth'
import {
  computePasseportPlacement,
  getDistanceInMeters,
  getTamponColor,
  unlockChapitreRewardIfComplete,
} from '~~/server/utils/checkin'

const CHECKIN_RADIUS_METERS = 1400

type LinkedHistoire = {
  id: number
  chapitreId: number
  chapitreTitre: string
  restaurantId: number
  ordre: number
  titre: string
  contenu: string
  imageCarteUrl: string | null
}

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
    data: {
      userId,
      restaurantId,
      checkedAt: body.visited_at ? new Date(body.visited_at) : new Date(),
    },
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

  const histoires = await prisma.$queryRaw<LinkedHistoire[]>`
    SELECT
      h.id,
      h.chapitre_id AS "chapitreId",
      c.titre AS "chapitreTitre",
      h.restaurant_id AS "restaurantId",
      h.ordre,
      h.titre,
      h.contenu,
      h.image_carte_url AS "imageCarteUrl"
    FROM histoires h
    JOIN chapitres c ON c.id = h.chapitre_id
    WHERE h.restaurant_id = ${restaurantId}
    LIMIT 1
  `

  const histoire = histoires[0] ?? null

  let histoireDebloquee: {
    id: number
    chapitreId: number
    chapitreTitre: string
    ordre: number
    restaurantId: number
    titre: string
    contenu: string
    imageCarteUrl: string | null
    unlockedAt: Date
  } | null = null

  let recompenseDebloquee: {
    id: number
    chapitreId: number
    chapitreTitre: string
    titre: string
    description: string
    unlockedAt: Date
    isUsed: boolean
  } | null = null

  if (histoire) {
    const alreadyUnlockedHistoire = await prisma.userHistoire.findUnique({
      where: {
        userId_histoireId: {
          userId,
          histoireId: histoire.id,
        },
      },
    })

    let unlockedHistoire: { unlockedAt: Date } | null = null

    if (!alreadyUnlockedHistoire) {
      unlockedHistoire = await prisma.userHistoire.create({
        data: {
          userId,
          histoireId: histoire.id,
        },
      })
    }

    if (unlockedHistoire) {
      histoireDebloquee = {
        id: histoire.id,
        chapitreId: histoire.chapitreId,
        chapitreTitre: histoire.chapitreTitre,
        ordre: histoire.ordre,
        restaurantId: histoire.restaurantId,
        titre: histoire.titre,
        contenu: histoire.contenu,
        imageCarteUrl: histoire.imageCarteUrl,
        unlockedAt: unlockedHistoire.unlockedAt,
      }
    }

    recompenseDebloquee = await unlockChapitreRewardIfComplete(
      userId,
      histoire.chapitreId,
      histoire.chapitreTitre
    )
  }

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
    histoireDebloquee,
    recompenseDebloquee,
  }
})
