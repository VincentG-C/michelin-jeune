import { prisma } from '~~/server/utils/db'
import { getUserIdFromEvent } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)

  const allTampons = await prisma.tampon.findMany({
    include: {
      restaurant: true,
    },
    orderBy: { id: 'asc' },
  })

  const collectedTampons = await prisma.userTampon.findMany({
    where: { userId },
    select: { tamponId: true, collectedAt: true },
  })

  const collectedStats = new Map<number, { count: number, lastCollectedAt: Date | null }>()

  for (const collected of collectedTampons) {
    const current = collectedStats.get(collected.tamponId) || { count: 0, lastCollectedAt: null }

    current.count += 1

    if (!current.lastCollectedAt || collected.collectedAt > current.lastCollectedAt) {
      current.lastCollectedAt = collected.collectedAt
    }

    collectedStats.set(collected.tamponId, current)
  }

  return allTampons.map((tampon) => ({
    id: tampon.id,
    restaurantId: tampon.restaurantId,
    restaurantName: tampon.restaurant.name,
    imageUrl: tampon.imageUrl,
    color: tampon.color,
    unlocked: collectedStats.has(tampon.id),
    collectCount: collectedStats.get(tampon.id)?.count || 0,
    lastCollectedAt: collectedStats.get(tampon.id)?.lastCollectedAt || null,
  }))
})
