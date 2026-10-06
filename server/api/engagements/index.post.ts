import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateEngagementRequest } from '../../shared/requests'
import type { CreateEngagementResponse } from '../../shared/responses'
import type { EngagementCreate } from '../../shared/models'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../shared/constants'
import {
  resolveEngagementLevelId,
  resolveEngagementStatusId,
  resolveEngagementTypeId,
  mapEngagementListItem,
} from '../../shared/utils'
import { parseCreateEngagementPayload } from '../../shared/validation'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'
import { createEngagement } from '../../utils/engagements/createEngagement'
import { getEngagementById } from '~~/server/utils/engagements/getEngagementById'
import { deleteEngagementById } from '../../utils/engagements/deleteEngagementById'
import { notifyEngagementScheduled } from '../../utils/notifications/notifyEngagementScheduled'

export default defineEventHandler(async (event): Promise<CreateEngagementResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.engagementCreate)
  const body = await readBody<CreateEngagementRequest>(event)
  const parsedPayload = parseCreateEngagementPayload(body)

  const payload: EngagementCreate = { ...parsedPayload, created_by: actor.id }
  const supabase = getServiceSupabaseClient()
  const requestData = { ...body }

  try {
    if (payload.engagement_type_id) payload.engagement_type_id = await resolveEngagementTypeId(supabase, payload.engagement_type_id)
    if (payload.level_id) payload.level_id = await resolveEngagementLevelId(supabase, payload.level_id)
    payload.status_id = await resolveEngagementStatusId(supabase, payload.status_id)

    let createdEngagementId: string | null = null
    const result = await executeWithRollback({
      operation: async () => {
        const createdId = await createEngagement(supabase, payload)
        createdEngagementId = createdId
        return { createdId }
      },
      rollback: async () => {
        if (createdEngagementId) {
          await deleteEngagementById(supabase, createdEngagementId)
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Engagement create rollback error:', rollbackError)
      },
    })

    const newRow = await getEngagementById(supabase, result.createdId)
    if (!newRow) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load created engagement record.' })
    }

    const item = mapEngagementListItem(newRow)
    const newData: Record<string, unknown> = { ...item }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.engagementCreate,
      tableName: 'engagements',
      endpoint: AUDIT_LOG_ENDPOINTS.engagementsCreate,
      recordId: result.createdId,
      requestData: requestData,
      newData,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Engagement created successfully.',
    })

    notifyEngagementScheduled(item)

    return { ok: true, id: result.createdId, item }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.engagementCreate,
      tableName: 'engagements',
      endpoint: AUDIT_LOG_ENDPOINTS.engagementsCreate,
      requestData: body as Record<string, unknown>,
      statusCode: statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
