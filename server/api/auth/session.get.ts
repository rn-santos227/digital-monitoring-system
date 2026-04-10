import { createError, defineEventHandler, getCookie, getHeader } from 'h3'
import { SESSION_COOKIE_NAME, SESSION_TOKEN_HEADER_NAME } from '../../shared/constants'
import { requireAuth } from '../../utils/auth/requireAuth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  return { ok: true, user }
})
