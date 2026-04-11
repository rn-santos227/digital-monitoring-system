import type { H3Event } from 'h3'
import { getCookie, getHeader } from 'h3'
import { SESSION_COOKIE_NAME, SESSION_TOKEN_HEADER_NAME } from '../constants'

export const getSessionTokenFromEvent = (event: H3Event): string | null => {
  const tokenFromSessionHeader = getHeader(event, SESSION_TOKEN_HEADER_NAME)?.trim() || null
  if (tokenFromSessionHeader) {
    return tokenFromSessionHeader
  }

  const tokenFromCookie = getCookie(event, SESSION_COOKIE_NAME)
  return tokenFromCookie || null
}

export const getRequestIpAddress = (event: H3Event): string | null => {
  const forwardedFor = getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()

  return forwardedFor || event.node.req.socket?.remoteAddress || null
}
