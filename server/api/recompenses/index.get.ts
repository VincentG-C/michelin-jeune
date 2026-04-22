import { prisma } from '~~/server/utils/db'
import { getUserIdFromEvent } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)

  const totalTampons = await prisma.userTampon.count({
    where: { userId },
  })

  const allRecompenses = await prisma.recompense.findMany({
    orderBy: { tamponRequired: 'asc' },
  })

  const unlockedRecompenses = await prisma.userRecompense.findMany({
    where: { userId },
  })

  const unlockedMap = new Map(
    unlockedRecompenses.map((item) => [item.recompenseId, item])
  )

  return {
    totalTampons,
    recompenses: allRecompenses.map((recompense) => {
      const unlocked = unlockedMap.get(recompense.id)

      return {
        id: recompense.id,
        tamponRequired: recompense.tamponRequired,
        titre: recompense.titre,
        description: recompense.description,
        unlocked: Boolean(unlocked),
        unlockedAt: unlocked?.unlockedAt || null,
        isUsed: unlocked?.isUsed || false,
      }
    }),
  }
})
