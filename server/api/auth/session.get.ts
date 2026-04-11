import { createError, defineEventHandler } from 'h3'
import { getSessionTokenFromEvent } from '../../shared/utils'
import { requireAuth } from '../../utils/auth/requireAuth'

export default defineEventHandler(async (event) => {
  if (!getSessionTokenFromEvent(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Session token is missing' })
  }

  const user = await requireAuth(event)
  return { ok: true, user }
})
