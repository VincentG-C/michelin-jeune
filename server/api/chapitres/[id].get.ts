import { getUserIdFromEvent } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/db'
import { getChapitreRewardContent } from '~~/server/utils/checkin'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)
  const id = parseInt(getRouterParam(event, 'id') as string, 10)

  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de chapitre invalide',
    })
  }

  const chapitre = await prisma.chapitre.findUnique({
    where: { id },
    include: {
      histoires: {
        orderBy: { ordre: 'asc' },
        include: {
          restaurant: true,
          userHistoires: {
            where: { userId },
            select: {
              unlockedAt: true,
            },
          },
        },
      },
      recompense: {
        include: {
          userRecompenses: {
            where: { userId },
            select: {
              unlockedAt: true,
              isUsed: true,
            },
          },
        },
      },
    },
  })

  if (!chapitre) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Chapitre non trouvé',
    })
  }

  const histoires = chapitre.histoires.map((histoire) => {
    const unlockedData = histoire.userHistoires[0]
    // For demo: first story of each dossier is always unlocked
    const isFirstStory = histoire.ordre === 1
    const isUnlocked = Boolean(unlockedData) || isFirstStory

    return {
      id: histoire.id,
      ordre: histoire.ordre,
      titre: histoire.titre,
      contenu: histoire.contenu,
      imageCarteUrl: histoire.imageCarteUrl,
      restaurant: {
        id: histoire.restaurant.id,
        name: histoire.restaurant.name,
      },
      unlocked: isUnlocked,
      unlockedAt: unlockedData?.unlockedAt ?? null,
    }
  })

  const completed = histoires.length > 0 && histoires.every((histoire) => histoire.unlocked)
  const unlockedRewardData = chapitre.recompense?.userRecompenses[0]
  const rewardContent = getChapitreRewardContent(chapitre.ordre, chapitre.titre)

  return {
    id: chapitre.id,
    titre: chapitre.titre,
    ordre: chapitre.ordre,
    completed,
    histoires,
    recompense: chapitre.recompense
      ? {
          id: chapitre.recompense.id,
          titre: rewardContent.titre,
          description: rewardContent.description,
          unlocked: Boolean(unlockedRewardData),
          unlockedAt: unlockedRewardData?.unlockedAt ?? null,
          isUsed: unlockedRewardData?.isUsed ?? false,
        }
      : null,
  }
})
