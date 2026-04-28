import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateTrainingRequest } from '../../shared/requests'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../shared/constants'
import { resolveTrainingLevelId } from '../../shared/utils'
import { parseCreateTrainingPayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingCreate)
  const body = await readBody<CreateTrainingRequest>(event)
  const parsedPayload = parseCreateTrainingPayload(body)
  const payload = {
    ...parsedPayload,
    created_by: actor.id,
  }
  const supabase = getServiceSupabaseClient()

  try {
    if (payload.level_id) {
      payload.level_id = await resolveTrainingLevelId(supabase, payload.level_id)
    }

    const { data: createdRow, error: insertError } = await supabase
      .from('trainings')
      .insert(payload)
      .select('id')
      .maybeSingle<{ id: string }>()

    if (insertError || !createdRow?.id) {
      throw createError({ statusCode: 500, statusMessage: `Failed to create training: ${insertError?.message ?? 'Missing id.'}` })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingCreate,
      tableName: 'trainings',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingsCreate,
      recordId: createdRow.id,
      requestData: body as Record<string, unknown>,
      newData: payload,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training created successfully.',
    })

    return { ok: true, id: createdRow.id }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingCreate,
      tableName: 'trainings',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingsCreate,
      requestData: body as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
