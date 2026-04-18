import { defineEventHandler, deleteCookie } from 'h3'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUTH_SESSION_USER_ID_SELECT_COLUMNS,
  SESSION_COOKIE_NAME,
} from '../../shared/constants'
import { getSessionTokenFromEvent } from '../../shared/utils'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { recordApiAuditLog } from '../../utils/audit/recordApiAuditLog'

export default defineEventHandler(async (event) => {
  const token = getSessionTokenFromEvent(event)
  let userId: string | null = null

  if (token) {
    const supabase = getServiceSupabaseClient()
    const { data: currentSession } = await supabase
      .from('auth_sessions')
      .select(AUTH_SESSION_USER_ID_SELECT_COLUMNS)
      .eq('access_token', token)
      .maybeSingle()

    userId = currentSession?.user_id ?? null

    await supabase
      .from('auth_sessions')
      .update({ revoked_at: new Date().toISOString() })
      .eq('access_token', token)
      .is('revoked_at', null)
  }

  deleteCookie(event, SESSION_COOKIE_NAME, { path: '/' })

  await recordApiAuditLog(event, {
    userId,
    action: AUDIT_LOG_ACTIONS.logout,
    tableName: 'auth_sessions',
    requestData: {
      hasSessionToken: Boolean(token),
    },
    responseData: {
      ok: true,
    },
    statusCode: 200,
    metadata: {
      endpoint: AUDIT_LOG_ENDPOINTS.authLogout,
    },
  })

  return { ok: true }
})
