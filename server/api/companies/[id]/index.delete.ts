import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, COMPANY_BASE_SELECT_COLUMNS, PERMISSION_CODES } from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.companyDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Company id is required.')
  const supabase = getServiceSupabaseClient()

  const { data: existingRow, error: existingError } = await supabase
    .from('companies')
    .select(COMPANY_BASE_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (existingError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read company: ${existingError.message}` })
  }

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found.' })
  }

  try {
    const usageChecks = await Promise.all([
      supabase.from('personnel').select('id', { count: 'exact', head: true }).eq('company_id', id),
      supabase.from('equipment_assets').select('id', { count: 'exact', head: true }).eq('assigned_company_id', id),
    ])

    const hasUsage = usageChecks.some(result => (result.count ?? 0) > 0)

    if (hasUsage) {
      throw createError({ statusCode: 409, statusMessage: 'Company is in use and cannot be deleted.' })
    }

    const { error: deleteError } = await supabase.from('companies').delete().eq('id', id)

    if (deleteError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to delete company: ${deleteError.message}` })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.companyDelete,
      tableName: 'companies',
      endpoint: AUDIT_LOG_ENDPOINTS.companiesDelete,
      recordId: id,
      oldData: existingRow,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Company deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.companyDelete,
      tableName: 'companies',
      endpoint: AUDIT_LOG_ENDPOINTS.companiesDelete,
      recordId: id,
      oldData: existingRow,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
