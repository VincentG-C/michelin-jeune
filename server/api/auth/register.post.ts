import { prisma } from '~/server/utils/db'
import { hashPassword, generateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validation
  if (!body.email || !body.password || !body.username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email, mot de passe et username sont requis',
    })
  }

  // Check if email already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: body.email },
        { username: body.username },
      ],
    },
  })

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: existingUser.email === body.email
        ? 'Cet email est déjà utilisé'
        : 'Ce username est déjà pris',
    })
  }

  // Create user
  const hashedPassword = await hashPassword(body.password)
  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: hashedPassword,
      username: body.username,
    },
  })

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
