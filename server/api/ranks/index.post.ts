import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateRankRequest } from '../../shared/requests'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../shared/constants'
import { parseCreateRankPayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.personnelCreate)
  const body = await readBody<CreateRankRequest>(event)
  const payload = parseCreateRankPayload(body)
  const supabase = getServiceSupabaseClient()

  try {
    const { data: createdRow, error: insertError } = await supabase
      .from('ranks')
      .insert(payload)
      .select('id')
      .maybeSingle<{ id: string }>()

    if (insertError || !createdRow?.id) {
      throw createError({ statusCode: 500, statusMessage: `Failed to create rank: ${insertError?.message ?? 'Missing id.'}` })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.rankCreate,
      tableName: 'ranks',
      endpoint: AUDIT_LOG_ENDPOINTS.ranksCreate,
      recordId: createdRow.id,
      requestData: body as Record<string, unknown>,
      newData: payload,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Rank created successfully.',
    })

    return { ok: true, id: createdRow.id }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.rankCreate,
      tableName: 'ranks',
      endpoint: AUDIT_LOG_ENDPOINTS.ranksCreate,
      requestData: body as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
