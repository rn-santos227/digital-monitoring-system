import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteTrainingCategoryById } from '../../../utils/training-categories/deleteTrainingCategoryById'
import { getTrainingCategoryById } from '../../../utils/training-categories/getTrainingCategoryById'
import { getTrainingCategoryUsageCounts } from '../../../utils/training-categories/getTrainingCategoryUsageCounts'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Training category id is required.')
  const supabase = getServiceSupabaseClient()

  const existingRow = await getTrainingCategoryById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Training category not found.' })
  }

  const existingRowAuditData: Record<string, unknown> = { ...existingRow }
  try {
    const usageCount = await getTrainingCategoryUsageCounts(supabase, id)

    if (usageCount > 0) {
      throw createError({ statusCode: 409, statusMessage: 'Training category is in use and cannot be deleted.' })
    }

    await deleteTrainingCategoryById(supabase, id)
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingCategoryDelete,
      tableName: 'training_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingCategoriesDelete,
      recordId: id,
      oldData: existingRowAuditData,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training category deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingCategoryDelete,
      tableName: 'training_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingCategoriesDelete,
      recordId: id,
      oldData: existingRowAuditData,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
