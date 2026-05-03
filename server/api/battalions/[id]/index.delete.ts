import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteBattalionById } from '../../../utils/battalions/deleteBattalionById'
import { getBattalionById } from '../../../utils/battalions/getBattalionById'
import { getBattalionUsageCounts } from '../../../utils/battalions/getBattalionUsageCounts'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.battalionDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Battalion id is required.')
  const supabase = getServiceSupabaseClient()

  const existingRow = await getBattalionById(supabase, id)
  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Battalion not found.' })
  }

  const existingRowAuditData: Record<string, unknown> = { ...existingRow }
  try {
    const usageCount = await getBattalionUsageCounts(supabase, id)

    if (usageCount > 0) {
      throw createError({ statusCode: 409, statusMessage: 'Battalion is in use and cannot be deleted.' })
    }

    await deleteBattalionById(supabase, id)
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.battalionDelete,
      tableName: 'battalions',
      endpoint: AUDIT_LOG_ENDPOINTS.battalionsDelete,
      recordId: id,
      oldData: existingRowAuditData,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Battalion deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.battalionDelete,
      tableName: 'battalions',
      endpoint: AUDIT_LOG_ENDPOINTS.battalionsDelete,
      recordId: id,
      oldData: existingRowAuditData,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
