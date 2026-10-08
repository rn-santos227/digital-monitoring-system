import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validation'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteRankById } from '../../../utils/ranks/deleteRankById'
import { getRankById } from '../../../utils/ranks/getRankById'
import { getRankUsageCounts } from '../../../utils/ranks/getRankUsageCounts'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.rankDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Rank id is required.')
  const supabase = getServiceSupabaseClient()

  const existingRow = await getRankById(supabase, id)
  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Rank not found.' })
  }

  const existingRowAuditData: Record<string, unknown> = { ...existingRow }
  try {
    const usageCounts = await getRankUsageCounts(supabase, id)

    if (usageCounts.personnelCount > 0) {
      throw createError({ statusCode: 409, statusMessage: 'Rank is in use and cannot be deleted.' })
    }

    await deleteRankById(supabase, id)
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.rankDelete,
      tableName: 'ranks',
      endpoint: AUDIT_LOG_ENDPOINTS.ranksDelete,
      recordId: id,
      oldData: existingRowAuditData,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Rank deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.rankDelete,
      tableName: 'ranks',
      endpoint: AUDIT_LOG_ENDPOINTS.ranksDelete,
      recordId: id,
      oldData: existingRowAuditData,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
