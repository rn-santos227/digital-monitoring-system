import { defineEventHandler, readBody } from 'h3'
import type { RecordPrintedTableAuditRequest } from '../../shared/requests'
import type { RecordPrintedTableAuditResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../shared/constants'
import { parseRecordPrintedTableAuditPayload } from '../../shared/validations'
import { recordApiAuditLog } from '../../utils/audit/recordApiAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'

export default defineEventHandler(async (event): Promise<RecordPrintedTableAuditResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.auditView)
  const body = await readBody<RecordPrintedTableAuditRequest>(event)
  const payload = parseRecordPrintedTableAuditPayload(body)

  await recordApiAuditLog(event, {
    userId: actor.id,
    action: AUDIT_LOG_ACTIONS.dataTablePrint,
    tableName: payload.tableName,
    requestData: {
      tableName: payload.tableName,
      tableLabel: payload.tableLabel,
      filters: payload.filters,
    },
    responseData: {
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Data table print activity was recorded successfully.',
    },
    metadata: {
      endpoint: AUDIT_LOG_ENDPOINTS.auditPrint,
      activityType: 'data-table-print',
    },
    statusCode: 201,
  })

  return { ok: true }
})
