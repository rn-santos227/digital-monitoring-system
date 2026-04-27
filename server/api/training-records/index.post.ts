import { createError, defineEventHandler, readBody } from 'h3'
import type { TrainingRecordSourceRow } from '../../shared/models'
import type { CreateTrainingRecordRequest } from '../../shared/requests'
import type { CreateTrainingRecordResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  ID_ONLY_SELECT_COLUMNS,
  PERMISSION_CODES,
  TRAINING_RECORD_SOURCE_SELECT_COLUMNS,
} from '../../shared/constants'
import {
  assertPersonnelExists,
  buildTrainingRecordNo,
} from '../../shared/utils'
import { parseCreateTrainingRecordPayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<CreateTrainingRecordResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingCreate)
  const body = await readBody<CreateTrainingRecordRequest>(event)
  const supabase = getServiceSupabaseClient()

  try {
    const payload = parseCreateTrainingRecordPayload(body)
    const { data: training, error: trainingReadError } = await supabase
      .from('trainings')
      .select(TRAINING_RECORD_SOURCE_SELECT_COLUMNS)
      .eq('id', payload.training_id)
      .maybeSingle<TrainingRecordSourceRow>()

    if (trainingReadError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to read training source data: ${trainingReadError.message}` })
    }

    if (!training) {
      throw createError({ statusCode: 404, statusMessage: 'Training not found.' })
    }

    await assertPersonnelExists({
      supabase,
      personnelId: payload.personnel_id,
      idSelectColumns: ID_ONLY_SELECT_COLUMNS,
    })

    if (payload.valid_until && training.end_date) {
      const validUntilTimestamp = new Date(payload.valid_until).getTime()
      const trainingEndDateTimestamp = new Date(training.end_date).getTime()

      if (validUntilTimestamp < trainingEndDateTimestamp) {
        throw createError({ statusCode: 400, statusMessage: 'Valid until must be on or after training end date.' })
      }
    }

    const remarks = payload.remarks ?? training.default_remarks ?? null
    const insertPayload = {
      record_no: buildTrainingRecordNo(),
      personnel_id: payload.personnel_id,
      training_id: training.id,
      training_title: training.training_title,
      training_category_id: training.training_category_id,
      level_id: training.level_id,
      start_date: training.start_date,
      end_date: training.end_date,
      status_id: training.status_id,
      certificate_no: payload.certificate_no,
      valid_until: payload.valid_until,
      remarks,
    }

    const { data: createdRow, error: insertError } = await supabase
      .from('training_records')
      .insert(insertPayload)
      .select('id')
      .maybeSingle<{ id: string }>()

    if (insertError || !createdRow?.id) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create training record: ${insertError?.message ?? 'Missing id.'}`,
      })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingRecordCreate,
      tableName: 'training_records',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingRecordsCreate,
      recordId: createdRow.id,
      requestData: body as Record<string, unknown>,
      newData: insertPayload,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training record created successfully.',
    })

    return { ok: true, id: createdRow.id }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingRecordCreate,
      tableName: 'training_records',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingRecordsCreate,
      requestData: body as Record<string, unknown>,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
