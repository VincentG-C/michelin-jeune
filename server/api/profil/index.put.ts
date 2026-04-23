import { prisma } from '~~/server/utils/db'
import { getUserIdFromEvent } from '~~/server/utils/auth'
import { getProfileByUserId } from '~~/server/utils/profile'

const MAX_PREFERRED_FILTERS = 10
const MAX_FAVORITE_RESTAURANTS = 5

function normalizeRequiredString(value: unknown, fieldLabel: string) {
  if (typeof value !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: `${fieldLabel} invalide`,
    })
  }

  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw createError({
      statusCode: 400,
      statusMessage: `${fieldLabel} est requis`,
    })
  }

  return normalizedValue
}

function normalizeOptionalString(value: unknown, fieldLabel: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: `${fieldLabel} invalide`,
    })
  }

  const normalizedValue = value.trim()
  return normalizedValue ? normalizedValue : null
}

function normalizeStringList(value: unknown, fieldLabel: string) {
  if (value === undefined) {
    return undefined
  }

  if (!Array.isArray(value)) {
    throw createError({
      statusCode: 400,
      statusMessage: `${fieldLabel} doit etre une liste`,
    })
  }

  const normalizedValue = [
    ...new Set(
      value
        .filter((entry): entry is string => typeof entry === 'string')
        .map((entry) => entry.trim())
        .filter(Boolean)
    ),
  ]

  if (normalizedValue.length > MAX_PREFERRED_FILTERS) {
    throw createError({
      statusCode: 400,
      statusMessage: `Vous pouvez enregistrer jusqu'a ${MAX_PREFERRED_FILTERS} filtres`,
    })
  }

  return normalizedValue
}

function normalizeRestaurantIdList(value: unknown) {
  if (value === undefined) {
    return undefined
  }

  if (!Array.isArray(value)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Les restaurants favoris doivent etre une liste',
    })
  }

  const restaurantIds = [
    ...new Set(
      value
        .map((entry) => (typeof entry === 'string' || typeof entry === 'number' ? Number(entry) : NaN))
        .filter((entry) => Number.isInteger(entry) && entry > 0)
    ),
  ]

  if (restaurantIds.length !== value.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Un ou plusieurs restaurants favoris sont invalides',
    })
  }

  if (restaurantIds.length > MAX_FAVORITE_RESTAURANTS) {
    throw createError({
      statusCode: 400,
      statusMessage: `Vous pouvez enregistrer jusqu'a ${MAX_FAVORITE_RESTAURANTS} restaurants favoris`,
    })
  }

  return restaurantIds
}

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)
  const body = await readBody(event)

  const updateData: Record<string, unknown> = {}

  if (body.username !== undefined) {
    const username = normalizeRequiredString(body.username, 'Le username')
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        id: { not: userId },
      },
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Ce username est deja pris',
      })
    }

    updateData.username = username
  }

  if (body.email !== undefined) {
    const email = normalizeRequiredString(body.email, "L'email")
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: userId },
      },
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cet email est deja utilise',
      })
    }

    updateData.email = email
  }

  const phone = normalizeOptionalString(body.phone, 'Le telephone')
  if (phone !== undefined) {
    updateData.phone = phone
  }

  const bio = normalizeOptionalString(body.bio, 'La biographie')
  if (bio !== undefined) {
    updateData.bio = bio
  }

  const avatarUrl = normalizeOptionalString(body.avatarUrl, "L'avatar")
  if (avatarUrl !== undefined) {
    updateData.avatarUrl = avatarUrl
  }

  const preferredFilters = normalizeStringList(body.preferredFilters, 'Les filtres preferes')
  if (preferredFilters !== undefined) {
    updateData.preferredFilters = preferredFilters
  }

  const favoriteRestaurantIds = normalizeRestaurantIdList(body.favoriteRestaurantIds)
  if (favoriteRestaurantIds !== undefined) {
    if (favoriteRestaurantIds.length > 0) {
      const restaurants = await prisma.restaurant.findMany({
        where: { id: { in: favoriteRestaurantIds } },
        select: { id: true },
      })

      if (restaurants.length !== favoriteRestaurantIds.length) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Un ou plusieurs restaurants favoris sont introuvables',
        })
      }
    }

    updateData.favoriteRestaurantIds = favoriteRestaurantIds
  }

  if (Object.keys(updateData).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Aucune donnee a mettre a jour',
    })
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  })

  return getProfileByUserId(userId)
})
