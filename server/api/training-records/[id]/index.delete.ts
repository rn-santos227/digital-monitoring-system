import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  TRAINING_RECORD_SELECT_COLUMNS,
} from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Training record id is required.')
  const supabase = getServiceSupabaseClient()

  const { data: existingRow, error: existingError } = await supabase
    .from('training_records')
    .select(TRAINING_RECORD_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (existingError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read training record: ${existingError.message}` })
  }

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Training record not found.' })
  }

  try {
    const { error: deleteError } = await supabase.from('training_records').delete().eq('id', id)

    if (deleteError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to delete training record: ${deleteError.message}` })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingRecordDelete,
      tableName: 'training_records',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingRecordsDelete,
      recordId: id,
      oldData: existingRow,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training record deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingRecordDelete,
      tableName: 'training_records',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingRecordsDelete,
      recordId: id,
      oldData: existingRow,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
