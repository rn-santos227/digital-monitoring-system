import { createError, defineEventHandler, deleteCookie } from 'h3'
import { SESSION_COOKIE_NAME } from '../../shared/constants'
import { getSessionTokenFromEvent } from '../../shared/utils'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event) => {
  const token = getSessionTokenFromEvent(event)

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

  deleteCookie(event, SESSION_COOKIE_NAME, { path: '/' })
  return { ok: true }
})
