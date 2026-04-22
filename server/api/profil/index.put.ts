import { prisma } from '~/server/utils/db'
import { getUserIdFromEvent } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)
  const body = await readBody(event)

  // Only allow updating username and email
  const updateData: any = {}

  if (body.username) {
    // Check if username is taken
    const existing = await prisma.user.findFirst({
      where: {
        username: body.username,
        id: { not: userId },
      },
    })

    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Ce username est déjà pris',
      })
    }

    updateData.username = body.username
  }

  if (body.email) {
    // Check if email is taken
    const existing = await prisma.user.findFirst({
      where: {
        email: body.email,
        id: { not: userId },
      },
    })

    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cet email est déjà utilisé',
      })
    }

    updateData.email = body.email
  }

  if (Object.keys(updateData).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Aucune donnée à mettre à jour',
    })
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  })

  return user
})
