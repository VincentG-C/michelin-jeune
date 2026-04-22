import { prisma } from '~~/server/utils/db'
import { getDistanceInMeters } from '~~/server/utils/checkin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  if (!query.lat || !query.lng) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Latitude et longitude sont requises',
    })
  }

  const lat = parseFloat(query.lat as string)
  const lng = parseFloat(query.lng as string)
  const radiusKm = parseFloat((query.radius as string) || '5')

  const latDelta = radiusKm / 111
  const lngDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180))

  const restaurants = await prisma.restaurant.findMany({
    where: {
      lat: { gte: lat - latDelta, lte: lat + latDelta },
      lng: { gte: lng - lngDelta, lte: lng + lngDelta },
    },
  })

  const nearby = restaurants
    .map((r) => ({
      ...r,
      distance: Math.round(getDistanceInMeters(lat, lng, r.lat, r.lng)),
    }))
    .filter((r) => r.distance <= radiusKm * 1000)
    .sort((a, b) => a.distance - b.distance)

  return nearby
})
