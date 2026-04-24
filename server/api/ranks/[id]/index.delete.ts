import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  RANK_REFERENCE_ID_SELECT_COLUMNS,
} from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.personnelDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Rank id is required.')
  const supabase = getServiceSupabaseClient()

  const { data: existingRow, error: existingError } = await supabase
    .from('ranks')
    .select(RANK_REFERENCE_ID_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (existingError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read rank: ${existingError.message}` })
  }

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Rank not found.' })
  }

  try {
    const { count: usageCount, error: usageError } = await supabase
      .from('personnel')
      .select('id', { count: 'exact', head: true })
      .eq('rank_id', id)

    if (usageError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to validate rank usage: ${usageError.message}` })
    }

    if ((usageCount ?? 0) > 0) {
      throw createError({ statusCode: 409, statusMessage: 'Rank is in use and cannot be deleted.' })
    }

    const { error: deleteError } = await supabase.from('ranks').delete().eq('id', id)

    if (deleteError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to delete rank: ${deleteError.message}` })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.rankDelete,
      tableName: 'ranks',
      endpoint: AUDIT_LOG_ENDPOINTS.ranksDelete,
      recordId: id,
      oldData: existingRow,
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
      oldData: existingRow,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
