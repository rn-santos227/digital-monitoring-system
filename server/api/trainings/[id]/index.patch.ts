import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateTrainingRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  TRAINING_SELECT_COLUMNS,
} from '../../../shared/constants'
import { resolveTrainingLevelId } from '../../../shared/utils'
import { buildTrainingUpdates, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'

const assertValidDateRange = (startDate: string | null, endDate: string | null): void => {
  if (!startDate || !endDate) {
    return
  }

  if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
    throw createError({ statusCode: 400, statusMessage: 'End date must be on or after start date.' })
  }
}

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Training id is required.')
  const body = await readBody<UpdateTrainingRequest>(event)
  const updates = buildTrainingUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const { data: existingRow, error: existingError } = await supabase
    .from('trainings')
    .select(TRAINING_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (existingError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read training: ${existingError.message}` })
  }

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Training not found.' })
  }

  assertValidDateRange(
    updates.start_date ?? existingRow.start_date,
    updates.end_date ?? existingRow.end_date,
  )

  if (updates.level_id) {
    updates.level_id = await resolveTrainingLevelId(supabase, updates.level_id)
  }

  try {
    await executeWithRollback({
      operation: async () => {
        const { error } = await supabase.from('trainings').update(updates).eq('id', id)

        if (error) {
          throw createError({ statusCode: 500, statusMessage: `Failed to update training: ${error.message}` })
        }
      },
      rollback: async () => {
        const { error } = await supabase
          .from('trainings')
          .update({
            training_title: existingRow.training_title,
            training_category_id: existingRow.training_category_id,
            level_id: existingRow.level_id,
            start_date: existingRow.start_date,
            end_date: existingRow.end_date,
            status_id: existingRow.status_id,
            default_remarks: existingRow.default_remarks,
          })
          .eq('id', id)

        if (error) {
          throw error
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback training patch API changes.', rollbackError)
      },
    })

    const { data: updatedRow } = await supabase.from('trainings').select(TRAINING_SELECT_COLUMNS).eq('id', id).maybeSingle()

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingUpdate,
      tableName: 'trainings',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRow,
      newData: updatedRow ?? existingRow,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingUpdate,
      tableName: 'trainings',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingsUpdate,
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
