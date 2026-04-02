import { createError, defineEventHandler, deleteCookie, getCookie, getHeader } from 'h3'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event) => {
  const bearer = getHeader(event, 'authorization')
  const tokenFromHeader = bearer?.startsWith('Bearer ') ? bearer.slice(7).trim() : null
  const token = tokenFromHeader || getCookie(event, 'dms_session')

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'No active session token found' })
  }

  const supabase = getServiceSupabaseClient()
  const { error } = await supabase
    .from('auth_sessions')
    .update({ revoked_at: new Date().toISOString() })
    .eq('access_token', token)
    .is('revoked_at', null)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Logout failed: ${error.message}` })
  }

  deleteCookie(event, 'dms_session', { path: '/' })
  return { ok: true }
})
