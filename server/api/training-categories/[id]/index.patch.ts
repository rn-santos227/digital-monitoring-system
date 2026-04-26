import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateTrainingCategoryRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  TRAINING_CATEGORY_SELECT_COLUMNS,
} from '../../../shared/constants'
import { buildTrainingCategoryUpdates, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Training category id is required.')
  const body = await readBody<UpdateTrainingCategoryRequest>(event)
  const updates = buildTrainingCategoryUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const { data: existingRow, error: existingError } = await supabase
    .from('training_categories')
    .select(TRAINING_CATEGORY_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (existingError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read training category: ${existingError.message}` })
  }

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Training category not found.' })
  }

  try {
    await executeWithRollback({
      operation: async () => {
        const { error } = await supabase.from('training_categories').update(updates).eq('id', id)

        if (error) {
          throw createError({ statusCode: 500, statusMessage: `Failed to update training category: ${error.message}` })
        }
      },
      rollback: async () => {
        const { error } = await supabase
          .from('training_categories')
          .update({
            code: existingRow.code,
            name: existingRow.name,
          })
          .eq('id', id)

        if (error) {
          throw error
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback training category patch API changes.', rollbackError)
      },
    })

    const { data: updatedRow } = await supabase.from('training_categories').select(TRAINING_CATEGORY_SELECT_COLUMNS).eq('id', id).maybeSingle()

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingCategoryUpdate,
      tableName: 'training_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingCategoriesUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRow,
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
      oldData: existingRow,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
