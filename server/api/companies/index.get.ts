import { createError, defineEventHandler, getQuery } from 'h3'
import type { CompanyListResponse } from '../../shared/responses'
import { COMPANY_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapCompanyListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<CompanyListResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.companyManagement)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const includeInactive = query.includeInactive === 'true'
  const battalionId = typeof query.battalionId === 'string' && query.battalionId.length > 0 ? query.battalionId : null

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  let companyQuery = supabase
    .from('companies')
    .select(COMPANY_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    companyQuery = companyQuery.or(`code.ilike.%${search}%,name.ilike.%${search}%`)
  }

  if (!includeInactive) {
    companyQuery = companyQuery.eq('is_active', true)
  }

  if (battalionId) {
    companyQuery = companyQuery.eq('battalion_id', battalionId)
  }

  const { data, count, error } = await companyQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch companies: ${error.message}` })
  }

  const items = (data ?? []).map(mapCompanyListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
