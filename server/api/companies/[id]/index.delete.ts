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
import { deleteCompanyById } from '../../../utils/companies/deleteCompanyById'
import { getCompanyById } from '../../../utils/companies/getCompanyById'
import { getCompanyUsageCounts } from '../../../utils/companies/getCompanyUsageCounts'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.companyDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Company id is required.')
  const supabase = getServiceSupabaseClient()

  const existingRow = await getCompanyById(supabase, id)
  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found.' })
  }

  const existingRowAuditData: Record<string, unknown> = { ...existingRow }
  try {
    const usageCounts = await getCompanyUsageCounts(supabase, id)
    const hasUsage = usageCounts.personnelCount > 0 || usageCounts.equipmentAssetCount > 0

    if (hasUsage) {
      throw createError({ statusCode: 409, statusMessage: 'Company is in use and cannot be deleted.' })
    }

    await deleteCompanyById(supabase, id)
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.companyDelete,
      tableName: 'companies',
      endpoint: AUDIT_LOG_ENDPOINTS.companiesDelete,
      recordId: id,
      oldData: existingRowAuditData,
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
      oldData: existingRowAuditData,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
