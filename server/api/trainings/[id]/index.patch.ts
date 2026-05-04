import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateTrainingRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import type { TrainingUpdate } from '../../../shared/models'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { resolveTrainingLevelId, resolveTrainingStatusId, mapTrainingListItem } from '../../../shared/utils'
import { buildTrainingUpdates, requireRouteId, validateTrainingDateRange } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { getTrainingById } from '../../../utils/trainings/getTrainingById'
import { updateTrainingById } from '../../../utils/trainings/updateTrainingById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Training id is required.')
  const body = await readBody<UpdateTrainingRequest>(event)
  const parsedUpdates = buildTrainingUpdates(body)
  if (Object.keys(parsedUpdates).length === 0) throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  const supabase = getServiceSupabaseClient()

  const existingRow = await getTrainingById(supabase, id)
  if (!existingRow) throw createError({ statusCode: 404, statusMessage: 'Training not found.' })
  const oldData = { ...mapTrainingListItem(existingRow) }

  validateTrainingDateRange(parsedUpdates.start_date ?? existingRow.start_date, parsedUpdates.end_date ?? existingRow.end_date)
  const updates: TrainingUpdate = {
    training_title: parsedUpdates.training_title ?? existingRow.training_title,
    training_category_id: parsedUpdates.training_category_id === undefined ? existingRow.training_category_id : parsedUpdates.training_category_id,
    level_id: parsedUpdates.level_id === undefined ? existingRow.level_id : parsedUpdates.level_id,
    start_date: parsedUpdates.start_date === undefined ? existingRow.start_date : parsedUpdates.start_date,
    end_date: parsedUpdates.end_date === undefined ? existingRow.end_date : parsedUpdates.end_date,
    status_id: parsedUpdates.status_id ?? existingRow.status_id,
    default_remarks: parsedUpdates.default_remarks === undefined ? existingRow.default_remarks : parsedUpdates.default_remarks,
  }

  if (updates.level_id) updates.level_id = await resolveTrainingLevelId(supabase, updates.level_id)
  updates.status_id = await resolveTrainingStatusId(supabase, updates.status_id)

  try {
    await executeWithRollback({
      operation: async () => { await updateTrainingById(supabase, id, updates) },
      rollback: async () => { await updateTrainingById(supabase, id, {
        training_title: existingRow.training_title,
        training_category_id: existingRow.training_category_id,
        level_id: existingRow.level_id,
        start_date:existingRow.start_date,
        end_date: existingRow.end_date,
        status_id: existingRow.status_id,
        default_remarks: existingRow.default_remarks
      })},
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback training patch API changes.', rollbackError)
      },
    })

    const updatedRow = await getTrainingById(supabase, id)
    const newData = updatedRow
      ? { ...mapTrainingListItem(updatedRow) }
      : oldData

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingUpdate,
      tableName: 'trainings',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: oldData,
      newData,
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
      oldData: oldData,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
