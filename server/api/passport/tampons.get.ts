import { prisma } from '~/server/utils/db'
import { getUserIdFromEvent } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)

  // Get all tampons
  const allTampons = await prisma.tampon.findMany({
    orderBy: { id: 'asc' },
  })

  // Get user's unlocked tampons
  const unlockedTampons = await prisma.userTampon.findMany({
    where: { userId },
    select: { tamponId: true, unlockedAt: true },
  })

  const unlockedMap = new Map(
    unlockedTampons.map((ut) => [ut.tamponId, ut.unlockedAt])
  )

  // Return all tampons with unlock status
  return allTampons.map((tampon) => ({
    id: tampon.id,
    name: tampon.name,
    description: tampon.description,
    icon: tampon.icon,
    unlocked: unlockedMap.has(tampon.id),
    unlockedAt: unlockedMap.get(tampon.id) || null,
  }))
})
