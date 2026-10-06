import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateBattalionRequest } from '../../shared/requests'
import type { CreateBattalionResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../shared/constants'
import { parseCreateBattalionPayload } from '../../shared/validation'
import { mapBattalionListItem } from '../../shared/utils'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { createBattalion } from '../../utils/battalions/createBattalion'
import { getBattalionById } from '../../utils/battalions/getBattalionById'

export default defineEventHandler(async (event): Promise<CreateBattalionResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.battalionCreate)
  const body = await readBody<CreateBattalionRequest>(event)
  const payload = parseCreateBattalionPayload(body)
  const supabase = getServiceSupabaseClient()

  try {
    const createdId = await createBattalion(supabase, payload)

    const createdBattalion = await getBattalionById(supabase, createdId)

    if (!createdBattalion) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load created battalion.' })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.battalionCreate,
      tableName: 'battalions',
      endpoint: AUDIT_LOG_ENDPOINTS.battalionsCreate,
      recordId: createdId,
      requestData: body as Record<string, unknown>,
      newData: payload,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Battalion created successfully.',
    })

    return {
      ok: true,
      id: createdId,
      item: mapBattalionListItem(createdBattalion),
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.battalionCreate,
      tableName: 'battalions',
      endpoint: AUDIT_LOG_ENDPOINTS.battalionsCreate,
      requestData: body as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
