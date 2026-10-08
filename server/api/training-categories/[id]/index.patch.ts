import {
  createError,
  defineEventHandler,
  getRouterParam,
  readBody,
} from 'h3'
import type { UpdateTrainingCategoryRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { buildTrainingCategoryUpdates, requireRouteId } from '../../../shared/validation'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { getTrainingCategoryById } from '../../../utils/training-categories/getTrainingCategoryById'
import { updateTrainingCategoryById } from '../../../utils/training-categories/updateTrainingCategoryById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Training category id is required.')
  const body = await readBody<UpdateTrainingCategoryRequest>(event)
  const updates = buildTrainingCategoryUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const existingRow = await getTrainingCategoryById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Training category not found.' })
  }

  const existingRowAuditData: Record<string, unknown> = { ...existingRow }
  try {
    await executeWithRollback({
      operation: async () => {
        await updateTrainingCategoryById(supabase, id, updates)
      },
      rollback: async () => {
        await updateTrainingCategoryById(supabase, id, {
          code: existingRow.code,
          name: existingRow.name,
        })
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback training category patch API changes.', rollbackError)
      },
    })

    const updatedRow = await getTrainingCategoryById(supabase, id)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingCategoryUpdate,
      tableName: 'training_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingCategoriesUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRowAuditData,
      newData: updatedRow ?? existingRow,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training category updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingCategoryUpdate,
      tableName: 'training_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingCategoriesUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRowAuditData,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
