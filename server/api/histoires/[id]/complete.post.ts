import { getUserIdFromEvent } from '~~/server/utils/auth'
import { unlockChapitreRewardIfComplete } from '~~/server/utils/checkin'
import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)
  const id = parseInt(getRouterParam(event, 'id') as string, 10)

  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID histoire invalide',
    })
  }

  const histoire = await prisma.histoire.findUnique({
    where: { id },
    include: {
      chapitre: true,
    },
  })

  if (!histoire) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Histoire non trouvée',
    })
  }

  const unlockedHistoire = await prisma.userHistoire.findUnique({
    where: {
      userId_histoireId: {
        userId,
        histoireId: histoire.id,
      },
    },
  })

  if (!unlockedHistoire) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Histoire non débloquée',
    })
  }

  const totalHistoiresInChapter = await prisma.histoire.count({
    where: {
      chapitreId: histoire.chapitreId,
    },
  })

  const unlockedHistoiresInChapter = await prisma.userHistoire.count({
    where: {
      userId,
      histoire: {
        chapitreId: histoire.chapitreId,
      },
    },
  })

  const chapitreComplet = totalHistoiresInChapter > 0 && unlockedHistoiresInChapter >= totalHistoiresInChapter

  const recompenseDebloquee = chapitreComplet
    ? await unlockChapitreRewardIfComplete(userId, histoire.chapitreId, histoire.chapitre.titre)
    : null

  return {
    histoire: {
      id: histoire.id,
      chapitreId: histoire.chapitreId,
      chapitreTitre: histoire.chapitre.titre,
      titre: histoire.titre,
      contenu: histoire.contenu,
      imageCarteUrl: histoire.imageCarteUrl,
      unlockedAt: unlockedHistoire.unlockedAt,
    },
    chapitreComplet,
    recompenseDebloquee,
  }
})
