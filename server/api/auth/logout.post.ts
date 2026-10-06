import { defineEventHandler, deleteCookie } from 'h3'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  SESSION_COOKIE_NAME,
} from '../../shared/constants'
import { getSessionTokenFromEvent } from '../../shared/utils'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { recordAuthAuditLog } from '../../utils/auth/recordAuthAuditLog'
import { revokeSessionByToken } from '../../utils/auth/revokeSessionByToken'

export default defineEventHandler(async (event) => {
  const token = getSessionTokenFromEvent(event)
  let userId: string | null = null

  // Logout also clears expired or missing sessions, so it must remain idempotent.
  try {
    if (token) {
      userId = await revokeSessionByToken(getServiceSupabaseClient(), token)
    }

    await recordAuthAuditLog(event, {
      userId,
      action: AUDIT_LOG_ACTIONS.logout,
      tableName: 'auth_sessions',
      requestData: { hasSessionToken: Boolean(token) },
      responseData: { ok: true, outcome: AUDIT_LOG_OUTCOMES.success },
      statusCode: 200,
      metadata: { endpoint: AUDIT_LOG_ENDPOINTS.authLogout },
    })

    return { ok: true }
  } catch (error: unknown) {
    await recordAuthAuditLog(event, {
      userId,
      action: AUDIT_LOG_ACTIONS.logout,
      tableName: 'auth_sessions',
      requestData: { hasSessionToken: Boolean(token) },
      responseData: {
        outcome: AUDIT_LOG_OUTCOMES.failed,
        message: error instanceof Error ? error.message : 'Unable to revoke the session.',
      },
      statusCode: 500,
      metadata: { endpoint: AUDIT_LOG_ENDPOINTS.authLogout },
    })
    throw error
  } finally {
    deleteCookie(event, SESSION_COOKIE_NAME, { path: '/' })
  }
})
