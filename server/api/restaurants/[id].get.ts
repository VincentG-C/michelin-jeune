import { prisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') as string)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID invalide',
    })
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
  })

  if (!restaurant) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Restaurant non trouvé',
    })
  }

  return restaurant
})
