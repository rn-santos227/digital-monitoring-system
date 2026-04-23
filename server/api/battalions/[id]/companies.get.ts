import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { BattalionCompanyListResponse } from '../../../shared/responses'
import {
  BATTALION_COMPANY_LIST_SELECT_COLUMNS,
  ID_ONLY_SELECT_COLUMNS,
  UNIT_PERMISSION_GROUPS,
} from '../../../shared/constants'
import {
  assertBattalionExists,
  mapCompanyListItem,
  parseManagementPaginationQuery,
} from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<BattalionCompanyListResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.battalionManagement)

  const battalionId = requireRouteId(getRouterParam(event, 'id'), 'Battalion id is required.')
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  await assertBattalionExists({
    supabase,
    battalionId,
    idSelectColumns: ID_ONLY_SELECT_COLUMNS,
  })

  let companyQuery = supabase
    .from('companies')
    .select(BATTALION_COMPANY_LIST_SELECT_COLUMNS, { count: 'exact' })
    .eq('battalion_id', battalionId)
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (!includeInactive) {
    companyQuery = companyQuery.eq('is_active', true)
  }

  if (search.length > 0) {
    companyQuery = companyQuery.or(`code.ilike.%${search}%,name.ilike.%${search}%`)
  }

  const { data, count, error } = await companyQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch battalion companies: ${error.message}` })
  }

  const items = (data ?? []).map(mapCompanyListItem)
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
