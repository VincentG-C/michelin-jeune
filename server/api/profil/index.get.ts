import { getUserIdFromEvent } from '~~/server/utils/auth'
import { getProfileByUserId } from '~~/server/utils/profile'

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromEvent(event)
  return getProfileByUserId(userId)
})
