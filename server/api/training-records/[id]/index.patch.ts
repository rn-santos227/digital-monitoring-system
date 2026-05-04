import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateTrainingRecordRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, ID_ONLY_SELECT_COLUMNS, PERMISSION_CODES } from '../../../shared/constants'
import { assertPersonnelExists, mapTrainingRecordListItem } from '../../../shared/utils'
import { buildTrainingRecordUpdates, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { getTrainingRecordById } from '../../../utils/training-records/getTrainingRecordById'
import { updateTrainingRecordById } from '../../../utils/training-records/updateTrainingRecordById'
import { getTrainingSourceById } from '../../../utils/training-records/getTrainingSourceById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingManage)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Training record id is required.')
  const body = await readBody<UpdateTrainingRecordRequest>(event)
  const updates = buildTrainingRecordUpdates(body)

  if (Object.keys(updates).length === 0) throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })

  const supabase = getServiceSupabaseClient()
  const existingRow = await getTrainingRecordById(supabase, id)
  if (!existingRow) throw createError({ statusCode: 404, statusMessage: 'Training record not found.' })


  const effectiveTrainingId = updates.training_id ?? existingRow.training_id

  if (!effectiveTrainingId) throw createError({ statusCode: 400, statusMessage: 'Training id is required.' })
  const training = await getTrainingSourceById(supabase, effectiveTrainingId)
  if (!training) throw createError({ statusCode: 404, statusMessage: 'Training not found.' })

  const effectivePersonnelId = updates.personnel_id ?? existingRow.personnel_id
  await assertPersonnelExists({ supabase, personnelId: effectivePersonnelId, idSelectColumns: ID_ONLY_SELECT_COLUMNS })
  const effectiveValidUntil = updates.valid_until === undefined ? existingRow.valid_until : updates.valid_until

  if (effectiveValidUntil && training.end_date && new Date(effectiveValidUntil).getTime() < new Date(training.end_date).getTime()) {
    throw createError({ statusCode: 400, statusMessage: 'Valid until must be on or after training end date.' })
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

  const requestData = { ...body }
  const oldData = { ...mapTrainingRecordListItem(existingRow) }

  try {
    await executeWithRollback({
      operation: async () => updateTrainingRecordById(supabase, id, patchPayload),
      rollback: async () => updateTrainingRecordById(supabase, id, {
        training_id: existingRow.training_id ?? training.id,
        training_title: existingRow.training_title,
        training_category_id: existingRow.training_category_id,
        level_id: existingRow.level_id,
        start_date: existingRow.start_date,
        end_date: existingRow.end_date,
        status_id: existingRow.status_id,
        personnel_id: existingRow.personnel_id,
        certificate_no: existingRow.certificate_no,
        valid_until: existingRow.valid_until,
        remarks: existingRow.remarks,
      }),
      onRollbackError: (rollbackError) => console.error('Failed to rollback training record patch API changes.', rollbackError),
    })

    const updatedRow = await getTrainingRecordById(supabase, id)
    const newData = updatedRow
      ? { ...mapTrainingRecordListItem(updatedRow) }
      : oldData

    await recordManagementAuditLog(event, { 
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingRecordUpdate,
      tableName: 'training_records',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingRecordsUpdate,
      recordId: id,
      requestData,
      oldData,
      newData,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training record updated successfully.'
    })
    return { ok: true }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingRecordUpdate,
      tableName: 'training_records',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingRecordsUpdate,
      recordId: id,
      requestData,
      oldData,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
