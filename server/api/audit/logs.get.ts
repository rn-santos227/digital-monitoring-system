import { createError, defineEventHandler, getQuery } from 'h3'
import type { AuditLogListResponse } from '../../shared/models'
import { mapAuditLogListItem, parsePaginationQuery } from '../../shared/utils'
import { requireAuth } from '../../utils/auth/requireAuth'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<AuditLogListResponse> => {
  await requireAuth(event)

  const query = getQuery(event)
  const { page, pageSize, rangeFrom, rangeTo } = parsePaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const { data, count, error } = await supabase
    .from('audit_logs')
    .select('id, action, table_name, record_id, created_at, user:user_profiles(full_name, email)', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range(rangeFrom, rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch audit logs: ${error.message}` })
  }

  const items = (data ?? []).map(mapAuditLogListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
  }
})
