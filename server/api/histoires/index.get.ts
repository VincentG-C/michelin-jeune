import { prisma } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const histoires = await prisma.histoire.findMany({
    select: {
      id: true,
      titre: true,
      imageCarteUrl: true,
      conditionUnlock: true,
    },
    orderBy: { id: 'asc' },
  })

  return histoires.map((h) => ({
    ...h,
    conditionUnlock: JSON.parse(h.conditionUnlock),
  }))
})
