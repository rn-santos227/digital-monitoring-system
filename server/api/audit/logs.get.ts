import { defineEventHandler, getQuery } from 'h3'
import type { AuditLogListResponse } from '../../shared/models'
import { mapAuditLogListItem, parsePaginationQuery } from '../../shared/utils'
import { PERMISSION_CODES } from '../../shared/constants'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchAuditLogsList } from '../../utils/audit/fetchAuditLogsList'

export default defineEventHandler(async (event): Promise<AuditLogListResponse> => {
  await requirePermission(event, PERMISSION_CODES.auditView)

  const query = getQuery(event)
  const { page, pageSize, rangeFrom, rangeTo } = parsePaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await fetchAuditLogsList({
    supabase,
    rangeFrom,
    rangeTo,
  })

  const items = rows.map(mapAuditLogListItem)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
  }
})
