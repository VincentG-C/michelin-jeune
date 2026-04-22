import { prisma } from '~/server/utils/db'
import { getUserIdFromEvent } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)

  // Get user's unlocked histoires with full content
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
