import { prisma } from '~~/server/utils/db'
import { getUserIdFromEvent } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)

  const collectedTampons = await prisma.userTampon.findMany({
    where: { userId },
    include: {
      tampon: {
        include: {
          restaurant: true,
        },
      },
    },
    orderBy: [
      { pageNumber: 'asc' },
      { collectedAt: 'asc' },
    ],
  })

  const pagesMap = new Map<number, Array<{
    id: number
    tamponId: number
    restaurantId: number
    restaurantName: string
    imageUrl: string | null
    color: string
    positionX: number
    positionY: number
    collectedAt: Date
  }>>()

  for (const collected of collectedTampons) {
    const currentPage = pagesMap.get(collected.pageNumber) || []

    currentPage.push({
      id: collected.id,
      tamponId: collected.tamponId,
      restaurantId: collected.tampon.restaurantId,
      restaurantName: collected.tampon.restaurant.name,
      imageUrl: collected.tampon.imageUrl,
      color: collected.tampon.color,
      positionX: collected.positionX,
      positionY: collected.positionY,
      collectedAt: collected.collectedAt,
    })

    pagesMap.set(collected.pageNumber, currentPage)
  }

  const pages = Array.from(pagesMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([pageNumber, tampons]) => ({
      pageNumber,
      tampons,
    }))

  return {
    totalTampons: collectedTampons.length,
    totalPages: pages.length,
    pages,
  }
})
