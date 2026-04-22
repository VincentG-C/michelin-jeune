import { prisma } from '~/server/utils/db'
import { verifyPassword, generateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validation
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email et mot de passe sont requis',
    })
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email ou mot de passe incorrect',
    })
  }

  // Verify password
  const isValid = await verifyPassword(body.password, user.password)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email ou mot de passe incorrect',
    })
  }

  // Generate token
  const token = generateToken(user.id)

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    token,
  }
})
