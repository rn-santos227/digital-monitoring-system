import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { mapTrainingRecordListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validation'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteTrainingRecordById } from '../../../utils/training-records/deleteTrainingRecordById'
import { getTrainingRecordById } from '../../../utils/training-records/getTrainingRecordById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingManage)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Training record id is required.')
  const supabase = getServiceSupabaseClient()
  const existingRow = await getTrainingRecordById(supabase, id)

  if (!existingRow) throw createError({ statusCode: 404, statusMessage: 'Training record not found.' })
  const oldData = { ...mapTrainingRecordListItem(existingRow) }
  
  try {
    await deleteTrainingRecordById(supabase, id)
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingRecordDelete,
      tableName: 'training_records',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingRecordsDelete,
      recordId: id,
      oldData,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training record deleted successfully.'
    })
    
    return { ok: true }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingRecordDelete,
      tableName: 'training_records',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingRecordsDelete,
      recordId: id,
      oldData,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message
    })
    throw error

  }
})
