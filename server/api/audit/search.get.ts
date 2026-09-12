import { defineEventHandler, getQuery } from 'h3'
import type { AuditLogListResponse } from '../../shared/models'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapAuditLogListItem, parsePaginationQuery } from '../../shared/utils'
import { parseAuditLogSearchQuery } from '../../shared/validations'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchAuditLogs } from '../../utils/audit/searchAuditLogs'

export default defineEventHandler(async (event): Promise<AuditLogListResponse> => {
  await requirePermission(event, PERMISSION_CODES.auditView)
  const query = getQuery(event)

  const search = parseAuditLogSearchQuery(query)
  const { page, pageSize, rangeFrom, rangeTo } = parsePaginationQuery(query)
  const { rows, totalItems } = await searchAuditLogs({
    supabase: getServiceSupabaseClient(),
    search,
    rangeFrom,
    rangeTo,
  })
})
