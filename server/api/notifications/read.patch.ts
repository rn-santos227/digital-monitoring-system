import { defineEventHandler } from 'h3'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES } from '../../shared/constants'
import type { MutationSuccessResponse } from '../../shared/responses'
import { requireAuth } from '../../utils/auth/requireAuth'
import { markCachedNotificationsRead } from '../../utils/notifications/markCachedNotificationsRead'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requireAuth(event)
  try {
    markCachedNotificationsRead(actor.id)
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.notificationsRead,
      tableName: 'notifications',
      endpoint: AUDIT_LOG_ENDPOINTS.notificationsRead,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
    })
    return { ok: true }
  } catch (error: unknown) {
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.notificationsRead,
      tableName: 'notifications',
      endpoint: AUDIT_LOG_ENDPOINTS.notificationsRead,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message: error instanceof Error ? error.message : 'Unable to mark notifications as read.',
    })
    throw error
  }
})
