import { prisma } from '~~/server/utils/db'
import { getUserIdFromEvent } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)

  const userHistoires = await prisma.userHistoire.findMany({
    where: { userId },
    include: {
      histoire: {
        include: {
          chapitre: true,
          restaurant: true,
        },
      },
    },
    orderBy: { unlockedAt: 'desc' },
  })

  return userHistoires.map((uh) => ({
    id: uh.histoire.id,
    chapitre: {
      id: uh.histoire.chapitre.id,
      titre: uh.histoire.chapitre.titre,
      ordre: uh.histoire.chapitre.ordre,
    },
    restaurant: {
      id: uh.histoire.restaurant.id,
      name: uh.histoire.restaurant.name,
    },
    ordre: uh.histoire.ordre,
    titre: uh.histoire.titre,
    contenu: uh.histoire.contenu,
    imageCarteUrl: uh.histoire.imageCarteUrl,
    unlockedAt: uh.unlockedAt,
  }))
})
