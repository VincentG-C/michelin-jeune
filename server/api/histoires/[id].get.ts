import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') as string)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID invalide',
    })
  }

  const histoire = await prisma.histoire.findUnique({
    where: { id },
  })

  if (!histoire) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Histoire non trouvée',
    })
  }

  return {
    ...histoire,
    conditionUnlock: JSON.parse(histoire.conditionUnlock),
  }
})
