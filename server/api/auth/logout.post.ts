import { defineEventHandler, deleteCookie } from 'h3'
import { SESSION_COOKIE_NAME } from '../../shared/constants'
import { getSessionTokenFromEvent } from '../../shared/utils'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event) => {
  const token = getSessionTokenFromEvent(event)

  if (token) {
    const supabase = getServiceSupabaseClient()
    await supabase
      .from('auth_sessions')
      .update({ revoked_at: new Date().toISOString() })
      .eq('access_token', token)
      .is('revoked_at', null)
  }

  deleteCookie(event, SESSION_COOKIE_NAME, { path: '/' })
  return { ok: true }
})
