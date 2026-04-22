import { createError, defineEventHandler, getQuery } from 'h3'
import type { BattalionListResponse } from '../../shared/responses'
import { BATTALION_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapBattalionListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'


export default defineEventHandler(async (event): Promise<BattalionListResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.battalionManagement)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const includeInactive = query.includeInactive === 'true'

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  let battalionQuery = supabase
    .from('battalions')
    .select(BATTALION_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    battalionQuery = battalionQuery.or(`code.ilike.%${search}%,name.ilike.%${search}%`)
  }

  if (!includeInactive) {
    battalionQuery = battalionQuery.eq('is_active', true)
  }

  const { data, count, error } = await battalionQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch battalions: ${error.message}` })
  }

  const items = (data ?? []).map(mapBattalionListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
