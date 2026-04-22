import { prisma } from '~~/server/utils/db'
import { getUserIdFromEvent } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)
  const id = parseInt(getRouterParam(event, 'id') as string)

  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID récompense invalide',
    })
  }

  const unlockedRecompense = await prisma.userRecompense.findUnique({
    where: {
      userId_recompenseId: {
        userId,
        recompenseId: id,
      },
    },
    include: {
      recompense: true,
    },
  })

  if (!unlockedRecompense) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Récompense non débloquée pour cet utilisateur',
    })
  }

  if (unlockedRecompense.isUsed) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Récompense déjà utilisée',
    })
  }

  const usedRecompense = await prisma.userRecompense.update({
    where: { id: unlockedRecompense.id },
    data: { isUsed: true },
    include: { recompense: true },
  })

  return {
    id: usedRecompense.recompense.id,
    tamponRequired: usedRecompense.recompense.tamponRequired,
    titre: usedRecompense.recompense.titre,
    description: usedRecompense.recompense.description,
    unlockedAt: usedRecompense.unlockedAt,
    isUsed: usedRecompense.isUsed,
  }
})
