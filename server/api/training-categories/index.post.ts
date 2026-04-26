import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateTrainingCategoryRequest } from '../../shared/requests'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../shared/constants'
import { parseCreateTrainingCategoryPayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingCreate)
  const body = await readBody<CreateTrainingCategoryRequest>(event)
  const payload = parseCreateTrainingCategoryPayload(body)
  const supabase = getServiceSupabaseClient()

  try {
    const { data: createdRow, error: insertError } = await supabase
      .from('training_categories')
      .insert(payload)
      .select('id')
      .maybeSingle<{ id: string }>()

    if (insertError || !createdRow?.id) {
      throw createError({ statusCode: 500, statusMessage: `Failed to create training category: ${insertError?.message ?? 'Missing id.'}` })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingCategoryCreate,
      tableName: 'training_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingCategoriesCreate,
      recordId: createdRow.id,
      requestData: body as Record<string, unknown>,
      newData: payload,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training category created successfully.',
    })

    return { ok: true, id: createdRow.id }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingCategoryCreate,
      tableName: 'training_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingCategoriesCreate,
      requestData: body as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
