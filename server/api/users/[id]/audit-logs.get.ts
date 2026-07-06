import { defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { AuditLogListResponse } from '../../../shared/models'
import { ID_ONLY_SELECT_COLUMNS, PERMISSION_CODES } from '../../../shared/constants'
import { mapAuditLogListItem, parsePaginationQuery } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAuth } from '../../../utils/auth/requireAuth'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchAuditLogsList } from '../../../utils/audit/fetchAuditLogsList'
import { getUserProfileById } from '../../../utils/users/getUserProfileById'
export default defineEventHandler(async (event): Promise<AuditLogListResponse> => {
  const actor = await requireAuth(event)
  const userId = requireRouteId(getRouterParam(event, 'id'), 'User id is required.')
  if (actor.id !== userId) {
    await requirePermission(event, PERMISSION_CODES.auditView)
  }

  const query = getQuery(event)
  const { page, pageSize, rangeFrom, rangeTo } = parsePaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  await getUserProfileById<{ id: string }>(
    supabase,
    userId,
    ID_ONLY_SELECT_COLUMNS,
    'Failed to validate user profile',
  )

  const { rows, totalItems } = await fetchAuditLogsList({
    supabase,
    rangeFrom,
    rangeTo,
    userId,
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
