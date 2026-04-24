import { prisma } from '~~/server/utils/db'
import { getUserIdFromEvent } from '~~/server/utils/auth'
import { getChapitreRewardContent } from '~~/server/utils/checkin'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)

  const allRecompenses = await prisma.recompense.findMany({
    include: { chapitre: true },
    orderBy: { chapitre: { ordre: 'asc' } },
  })

  const unlockedRecompenses = await prisma.userRecompense.findMany({
    where: { userId },
  })

  const unlockedMap = new Map(
    unlockedRecompenses.map((item) => [item.recompenseId, item])
  )

  return {
    recompenses: allRecompenses.map((recompense) => {
      const unlocked = unlockedMap.get(recompense.id)
      const rewardContent = getChapitreRewardContent(
        recompense.chapitre.ordre,
        recompense.chapitre.titre
      )

      return {
        id: recompense.id,
        chapitreId: recompense.chapitreId,
        chapitreTitre: recompense.chapitre.titre,
        chapitreOrdre: recompense.chapitre.ordre,
        titre: rewardContent.titre,
        description: rewardContent.description,
        unlocked: Boolean(unlocked),
        unlockedAt: unlocked?.unlockedAt || null,
        isUsed: unlocked?.isUsed || false,
      }
    }),
  }
})
