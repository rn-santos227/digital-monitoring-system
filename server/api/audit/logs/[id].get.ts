import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { AuditLogDetail } from '../../../shared/models'
import { AUDIT_LOG_DETAIL_SELECT_COLUMNS, PERMISSION_CODES } from '../../../shared/constants'
import { mapAuditLogDetail } from '../../../shared/utils'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<AuditLogDetail> => {
  await requirePermission(event, PERMISSION_CODES.auditView)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Audit log id is required' })
  }

  const supabase = getServiceSupabaseClient()
  const { data, error } = await supabase
    .from('audit_logs')
    .select(AUDIT_LOG_DETAIL_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch audit log details: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Audit log not found' })
  }

  return mapAuditLogDetail(data)
})
