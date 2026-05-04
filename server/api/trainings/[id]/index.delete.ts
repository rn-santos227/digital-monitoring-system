import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { mapTrainingListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteTrainingById } from '../../../utils/trainings/deleteTrainingById'
import { getTrainingById } from '../../../utils/trainings/getTrainingById'
import { getTrainingUsageCountById } from '../../../utils/trainings/getTrainingUsageCountById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Training id is required.')
  const supabase = getServiceSupabaseClient()

  const existingRow = await getTrainingById(supabase, id)
  if (!existingRow) throw createError({ statusCode: 404, statusMessage: 'Training not found.' })
  const oldData = { ...mapTrainingListItem(existingRow) }

  try {
    const usageCount = await getTrainingUsageCountById(supabase, id)
    if (usageCount > 0) throw createError({ statusCode: 409, statusMessage: 'Training is in use and cannot be deleted.' })
    await deleteTrainingById(supabase, id)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingDelete,
      tableName: 'trainings',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingsDelete,
      recordId: id,
      oldData,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingDelete,
      tableName: 'trainings',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingsDelete,
      recordId: id,
      oldData,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
