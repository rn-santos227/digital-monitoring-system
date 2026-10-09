import type { H3Event } from 'h3'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES } from '../../shared/constants'
import { recordAuthAuditLog } from './recordAuthAuditLog'

export const createLoginAuditHandlers = (event: H3Event, requestData: Record<string, unknown>) => {
  const writeLoginAttempt = async (
    statusCode: number,
    outcome: (typeof AUDIT_LOG_OUTCOMES)[keyof typeof AUDIT_LOG_OUTCOMES],
    userId?: string | null,
    message?: string,
  ) => {
    await recordAuthAuditLog(event, {
      userId: userId ?? null,
      action: AUDIT_LOG_ACTIONS.loginAttempt,
      tableName: 'auth_sessions',
      requestData,
      responseData: {
        outcome,
        message: message ?? null,
      },
      statusCode,
      metadata: {
        endpoint: AUDIT_LOG_ENDPOINTS.authLogin,
      },
    })
  }

  const writeLoginSuccess = async (userId: string, expiresAt: string) => {
    await recordAuthAuditLog(event, {
      userId,
      action: AUDIT_LOG_ACTIONS.login,
      tableName: 'auth_sessions',
      requestData,
      responseData: {
        ok: true,
        expiresAt,
      },
      statusCode: 200,
      metadata: {
        endpoint: AUDIT_LOG_ENDPOINTS.authLogin,
      },
    })
  }

  return { writeLoginAttempt, writeLoginSuccess }
}
