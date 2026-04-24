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
    include: {
      chapitre: true,
      restaurant: true,
    },
  })

  if (!histoire) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Histoire non trouvée',
    })
  }

  return {
    id: histoire.id,
    chapitre: {
      id: histoire.chapitre.id,
      titre: histoire.chapitre.titre,
      ordre: histoire.chapitre.ordre,
    },
    restaurant: {
      id: histoire.restaurant.id,
      name: histoire.restaurant.name,
    },
    ordre: histoire.ordre,
    titre: histoire.titre,
    contenu: histoire.contenu,
    imageCarteUrl: histoire.imageCarteUrl,
  }
})
