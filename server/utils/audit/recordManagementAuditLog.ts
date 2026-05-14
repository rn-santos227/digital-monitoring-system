import type { H3Event } from 'h3'
import { AUDIT_LOG_OUTCOMES } from '../../shared/constants'
import { recordApiAuditLog } from './recordApiAuditLog'

interface RecordManagementAuditLogInput {
  userId: string
  action: string
  tableName: string
  endpoint: string
  recordId?: string | null
  requestData?: object | null
  oldData?: object | null
  newData?: object | null
  statusCode: number
  outcome: (typeof AUDIT_LOG_OUTCOMES)[keyof typeof AUDIT_LOG_OUTCOMES]
  message?: string
}

const toAuditRecord = (value: object | null | undefined): Record<string, unknown> | null => {
  if (!value) {
    return null
  }

  return { ...value }
}

export const recordManagementAuditLog = async (event: H3Event, input: RecordManagementAuditLogInput): Promise<void> => {
  try {
    await recordApiAuditLog(event, {
      userId: input.userId,
      action: input.action,
      tableName: input.tableName,
      recordId: input.recordId ?? null,
      requestData: toAuditRecord(input.requestData),
      oldData: toAuditRecord(input.oldData),
      newData: toAuditRecord(input.newData),
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
