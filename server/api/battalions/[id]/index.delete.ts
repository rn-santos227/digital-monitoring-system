import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, BATTALION_SELECT_COLUMNS, PERMISSION_CODES } from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'


export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.battalionDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Battalion id is required.')
  const supabase = getServiceSupabaseClient()

  const { data: existingRow, error: existingError } = await supabase
    .from('battalions')
    .select(BATTALION_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (existingError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read battalion: ${existingError.message}` })
  }

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Battalion not found.' })
  }

  try {
    const usageChecks = await Promise.all([
      supabase.from('companies').select('id', { count: 'exact', head: true }).eq('battalion_id', id),
      supabase.from('personnel').select('id', { count: 'exact', head: true }).eq('battalion_id', id),
      supabase.from('equipment_assets').select('id', { count: 'exact', head: true }).eq('assigned_battalion_id', id),
      supabase.from('employment_statuses').select('id', { count: 'exact', head: true }).eq('battalion_id', id),
    ])

    const hasUsage = usageChecks.some(result => (result.count ?? 0) > 0)

    if (hasUsage) {
      throw createError({ statusCode: 409, statusMessage: 'Battalion is in use and cannot be deleted.' })
    }

    const { error: deleteError } = await supabase.from('battalions').delete().eq('id', id)

    if (deleteError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to delete battalion: ${deleteError.message}` })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.battalionDelete,
      tableName: 'battalions',
      endpoint: AUDIT_LOG_ENDPOINTS.battalionsDelete,
      recordId: id,
      oldData: existingRow,
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
      oldData: existingRow,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
