import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async () => {
  const histoires = await prisma.histoire.findMany({
    include: {
      chapitre: true,
      restaurant: true,
    },
    orderBy: [{ chapitre: { ordre: 'asc' } }, { ordre: 'asc' }],
  })

  return histoires.map((histoire) => ({
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
    imageCarteUrl: histoire.imageCarteUrl,
  }))
})
