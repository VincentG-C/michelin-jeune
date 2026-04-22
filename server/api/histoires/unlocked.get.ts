import { prisma } from '~/server/utils/db'
import { getUserIdFromEvent } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)

  const userHistoires = await prisma.userHistoire.findMany({
    where: { userId },
    include: { histoire: true },
    orderBy: { unlockedAt: 'desc' },
  })

  return userHistoires.map((uh) => ({
    id: uh.histoire.id,
    titre: uh.histoire.titre,
    contenu: uh.histoire.contenu,
    imageCarteUrl: uh.histoire.imageCarteUrl,
    unlockedAt: uh.unlockedAt,
  }))
})
