import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { AuditLogDetail } from '../../../shared/models'
import { PERMISSION_CODES } from '../../../shared/constants'
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
    .select('id, user_id, action, table_name, record_id, old_data, new_data, request_data, response_data, request_headers, ip_address, status_code, metadata, created_at, user:user_profiles(id, full_name, email, avatar_url, is_active)')
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
