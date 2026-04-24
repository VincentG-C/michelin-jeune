import { prisma } from '~~/server/utils/db'
import { getUserLevel, getUserLevelEmoji } from '~~/server/utils/auth'

const profileUserSelect = {
  id: true,
  email: true,
  username: true,
  phone: true,
  bio: true,
  avatarUrl: true,
  preferredFilters: true,
  favoriteRestaurantIds: true,
  createdAt: true,
} as const

export async function getProfileByUserId(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: profileUserSelect,
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Utilisateur non trouve',
    })
  }

  const [
    checkinCount,
    uniqueRestaurants,
    tamponCount,
    recompenseCount,
    userHistoires,
    favoriteRestaurants,
    badgeCollections,
  ] = await Promise.all([
    prisma.checkin.count({ where: { userId } }),
    prisma.checkin.groupBy({
      by: ['restaurantId'],
      where: { userId },
    }),
    prisma.userTampon.count({ where: { userId } }),
    prisma.userRecompense.count({ where: { userId } }),
    prisma.userHistoire.findMany({
      where: { userId },
      select: { histoireId: true },
    }),
    user.favoriteRestaurantIds.length > 0
      ? prisma.restaurant.findMany({
          where: { id: { in: user.favoriteRestaurantIds } },
          select: {
            id: true,
            name: true,
            photoUrl: true,
            michelinType: true,
            stars: true,
          },
        })
      : Promise.resolve([]),
    prisma.chapitre.findMany({
      orderBy: { ordre: 'asc' },
      include: {
        histoires: {
          orderBy: { ordre: 'asc' },
          include: {
            userHistoires: {
              where: { userId },
              select: {
                unlockedAt: true,
              },
            },
          },
        },
      },
    }),
  ])

  const unlockedHistoireIds = userHistoires.map(({ histoireId }) => histoireId)
  const favoriteRestaurantById = new Map(
    favoriteRestaurants.map((restaurant) => [restaurant.id, restaurant])
  )
  const orderedFavoriteRestaurants = user.favoriteRestaurantIds
    .map((restaurantId) => favoriteRestaurantById.get(restaurantId))
    .filter((restaurant): restaurant is NonNullable<typeof restaurant> => Boolean(restaurant))

  const level = getUserLevel(checkinCount)

  return {
    ...user,
    preferredFilters: [...user.preferredFilters],
    favoriteRestaurantIds: [...user.favoriteRestaurantIds],
    favoriteRestaurants: orderedFavoriteRestaurants,
    unlockedHistoireIds,
    badgeCollections: badgeCollections.map((chapitre) => ({
      chapitreId: chapitre.id,
      ordre: chapitre.ordre,
      titre: chapitre.titre,
      badges: chapitre.histoires.map((histoire) => ({
        id: histoire.id,
        ordre: histoire.ordre,
        unlocked: Boolean(histoire.userHistoires[0]),
        unlockedAt: histoire.userHistoires[0]?.unlockedAt ?? null,
      })),
    })),
    stats: {
      checkins: checkinCount,
      uniqueRestaurants: uniqueRestaurants.length,
      tampons: tamponCount,
      recompenses: recompenseCount,
      histoires: unlockedHistoireIds.length,
      level: {
        name: level,
        emoji: getUserLevelEmoji(level),
      },
    },
  }
}
