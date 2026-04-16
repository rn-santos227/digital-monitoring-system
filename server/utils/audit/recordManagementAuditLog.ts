import type { H3Event } from 'h3'
import { AUDIT_LOG_OUTCOMES } from '../../shared/constants'
import { recordApiAuditLog } from './recordApiAuditLog'

interface RecordManagementAuditLogInput {
  userId: string
  action: string
  tableName: string
  endpoint: string
  recordId?: string | null
  requestData?: Record<string, unknown> | null
  oldData?: Record<string, unknown> | null
  newData?: Record<string, unknown> | null
  statusCode: number
  outcome: (typeof AUDIT_LOG_OUTCOMES)[keyof typeof AUDIT_LOG_OUTCOMES]
  message?: string
}

export const recordManagementAuditLog = async (event: H3Event, input: RecordManagementAuditLogInput): Promise<void> => {
  try {
    await recordApiAuditLog(event, {
      userId: input.userId,
      action: input.action,
      tableName: input.tableName,
      recordId: input.recordId ?? null,
      requestData: input.requestData ?? null,
      oldData: input.oldData ?? null,
      newData: input.newData ?? null,
      responseData: {
        outcome: input.outcome,
        message: input.message ?? null,
      },
      statusCode: input.statusCode,
      metadata: {
        endpoint: input.endpoint,
      },
    })
  } catch (auditError) {
    console.error('Failed to persist management audit log.', auditError)
  }
}
