import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { mapEngagementListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteEngagementById } from '../../../utils/engagements/deleteEngagementById'
import { getEngagementById } from '../../../utils/engagements/getEngagementById'
import { getEngagementUsageCountById } from '../../../utils/engagements/getEngagementUsageCountById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.engagementDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Engagement id is required.')
  const supabase = getServiceSupabaseClient()

  const existingRow = await getEngagementById(supabase, id)
  if (!existingRow) throw createError({ statusCode: 404, statusMessage: 'Engagement not found.' })
  const oldData = { ...mapEngagementListItem(existingRow) }

  try {
    const usageCount = await getEngagementUsageCountById(supabase, id)
    if (usageCount > 0) throw createError({ statusCode: 409, statusMessage: 'Engagement is in use and cannot be deleted.' })
    await deleteEngagementById(supabase, id)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.engagementDelete,
      tableName: 'engagements',
      endpoint: AUDIT_LOG_ENDPOINTS.engagementsDelete,
      recordId: id,
      oldData,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Engagement deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.engagementDelete,
      tableName: 'engagements',
      endpoint: AUDIT_LOG_ENDPOINTS.engagementsDelete,
      recordId: id,
      oldData,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
