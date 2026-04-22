import { prisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const where: any = {}

  if (query.budget) {
    where.budget = query.budget
  }

  if (query.cuisine) {
    where.cuisine = { contains: query.cuisine as string, mode: 'insensitive' }
  }

  if (query.michelin_type) {
    where.michelinType = query.michelin_type
  }

  if (query.vibe) {
    const vibes = (query.vibe as string).split(',')
    if (vibes.includes('eco')) where.isEco = true
    if (vibes.includes('hidden_gem')) where.isHiddenGem = true
    if (vibes.includes('visual')) where.isVisual = true
  }

  if (query.lat && query.lng) {
    const lat = parseFloat(query.lat as string)
    const lng = parseFloat(query.lng as string)
    const radius = parseFloat((query.radius as string) || '5')

    const latDelta = radius / 111
    const lngDelta = radius / (111 * Math.cos(lat * Math.PI / 180))

    where.lat = { gte: lat - latDelta, lte: lat + latDelta }
    where.lng = { gte: lng - lngDelta, lte: lng + lngDelta }
  }

  const restaurants = await prisma.restaurant.findMany({
    where,
    orderBy: { stars: 'desc' },
  })

  return restaurants
})
