import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { AuditLogListResponse } from '../../../shared/models'
import {
  AUDIT_LOG_LIST_SELECT_COLUMNS,
  ID_ONLY_SELECT_COLUMNS,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { mapAuditLogListItem, parsePaginationQuery } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<AuditLogListResponse> => {
  await requirePermission(event, PERMISSION_CODES.auditView)

  const userId = requireRouteId(getRouterParam(event, 'id'), 'User id is required.')
  const query = getQuery(event)
  const { page, pageSize, rangeFrom, rangeTo } = parsePaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const { data: userProfile, error: userProfileError } = await supabase
    .from('user_profiles')
    .select(ID_ONLY_SELECT_COLUMNS)
    .eq('id', userId)
    .maybeSingle()

  if (userProfileError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to validate user profile: ${userProfileError.message}` })
  }

  if (!userProfile) {
    throw createError({ statusCode: 404, statusMessage: 'User profile not found.' })
  }

  const { data, count, error } = await supabase
    .from('audit_logs')
    .select(AUDIT_LOG_LIST_SELECT_COLUMNS, {
      count: 'exact',
    })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(rangeFrom, rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch user audit logs: ${error.message}` })
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
