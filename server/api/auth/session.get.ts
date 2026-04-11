import { createError, defineEventHandler, getCookie, getHeader } from 'h3'
import { SESSION_COOKIE_NAME, SESSION_TOKEN_HEADER_NAME } from '../../shared/constants'
import { requireAuth } from '../../utils/auth/requireAuth'

export default defineEventHandler(async (event) => {
  const sessionTokenFromStorage = getHeader(event, SESSION_TOKEN_HEADER_NAME)
  const sessionTokenFromCookie = getCookie(event, SESSION_COOKIE_NAME)

  const authorizationHeader = getHeader(event, 'authorization')

  if (sessionTokenFromStorage && sessionTokenFromCookie && sessionTokenFromStorage !== sessionTokenFromCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Session token mismatch' })
  }

  if (!sessionTokenFromStorage && !sessionTokenFromCookie && !authorizationHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Session token is missing' })
  }

  const user = await requireAuth(event)
  return { ok: true, user }
})
