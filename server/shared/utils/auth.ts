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
  const forwardedFor = getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || null
  const realIp = getHeader(event, 'x-real-ip')?.trim() || null
  const cfConnectingIp = getHeader(event, 'cf-connecting-ip')?.trim() || null
  const socketIp = event.node.req.socket?.remoteAddress?.trim() || null

  const rawIp = forwardedFor || realIp || cfConnectingIp || socketIp

  if (!rawIp) {
    return null
  }

  if (rawIp.startsWith('::ffff:')) {
    return rawIp.slice(7)
  }

  return rawIp
}
