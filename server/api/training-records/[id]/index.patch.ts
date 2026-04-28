import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { TrainingRecordSourceRow } from '../../../shared/models'
import type { UpdateTrainingRecordRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  ID_ONLY_SELECT_COLUMNS,
  PERMISSION_CODES,
  TRAINING_RECORD_SELECT_COLUMNS,
  TRAINING_RECORD_SOURCE_SELECT_COLUMNS,
} from '../../../shared/constants'
import {
  assertPersonnelExists,
} from '../../../shared/utils'
import { buildTrainingRecordUpdates, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingManage)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Training record id is required.')
  const body = await readBody<UpdateTrainingRecordRequest>(event)
  const updates = buildTrainingRecordUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

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

  const effectiveTrainingId = updates.training_id ?? existingRow.training_id

  if (!effectiveTrainingId) {
    throw createError({ statusCode: 400, statusMessage: 'Training id is required.' })
  }

  const { data: training, error: trainingError } = await supabase
    .from('trainings')
    .select(TRAINING_RECORD_SOURCE_SELECT_COLUMNS)
    .eq('id', effectiveTrainingId)
    .maybeSingle<TrainingRecordSourceRow>()

  if (trainingError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read training source data: ${trainingError.message}` })
  }

  if (!training) {
    throw createError({ statusCode: 404, statusMessage: 'Training not found.' })
  }

  const effectivePersonnelId = updates.personnel_id ?? existingRow.personnel_id
  await assertPersonnelExists({
    supabase,
    personnelId: effectivePersonnelId,
    idSelectColumns: ID_ONLY_SELECT_COLUMNS,
  })
  const effectiveValidUntil = updates.valid_until === undefined ? existingRow.valid_until : updates.valid_until

  if (effectiveValidUntil && training.end_date) {
    const validUntilTimestamp = new Date(effectiveValidUntil).getTime()
    const trainingEndDateTimestamp = new Date(training.end_date).getTime()

    if (validUntilTimestamp < trainingEndDateTimestamp) {
      throw createError({ statusCode: 400, statusMessage: 'Valid until must be on or after training end date.' })
    }
  }

  const patchPayload = {
    training_id: training.id,
    training_title: training.training_title,
    training_category_id: training.training_category_id,
    level_id: training.level_id,
    start_date: training.start_date,
    end_date: training.end_date,
    status_id: training.status_id,
    personnel_id: effectivePersonnelId,
    certificate_no: updates.certificate_no === undefined ? existingRow.certificate_no : updates.certificate_no,
    valid_until: effectiveValidUntil,
    remarks: updates.remarks === undefined ? existingRow.remarks : updates.remarks,
  }

  try {
    await executeWithRollback({
      operation: async () => {
        const { error } = await supabase.from('training_records').update(patchPayload).eq('id', id)

        if (error) {
          throw createError({ statusCode: 500, statusMessage: `Failed to update training record: ${error.message}` })
        }

      },
      rollback: async () => {
        const { error } = await supabase
          .from('training_records')
          .update({
            personnel_id: existingRow.personnel_id,
            training_id: existingRow.training_id,
            training_title: existingRow.training_title,
            training_category_id: existingRow.training_category_id,
            level_id: existingRow.level_id,
            start_date: existingRow.start_date,
            end_date: existingRow.end_date,
            status_id: existingRow.status_id,
            certificate_no: existingRow.certificate_no,
            valid_until: existingRow.valid_until,
            remarks: existingRow.remarks,
          })
          .eq('id', id)

        if (error) {
          throw error
        }

      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback training record patch API changes.', rollbackError)
      },
    })

    const { data: updatedRow } = await supabase
      .from('training_records')
      .select(TRAINING_RECORD_SELECT_COLUMNS)
      .eq('id', id)
      .maybeSingle()

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingRecordUpdate,
      tableName: 'training_records',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingRecordsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRow,
      newData: updatedRow ?? existingRow,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training record updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingRecordUpdate,
      tableName: 'training_records',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingRecordsUpdate,
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
