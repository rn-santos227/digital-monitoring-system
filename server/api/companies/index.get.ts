import { defineEventHandler, getQuery } from 'h3'
import type { CompanyListResponse } from '../../shared/responses'
import { UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapCompanyListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchCompaniesList } from '../../utils/companies/fetchCompaniesList'

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
  const result = await fetchCompaniesList(supabase, {
    search,
    includeInactive,
    battalionId,
    rangeFrom,
    rangeTo,
  })

  const items = result.data.map(mapCompanyListItem)
  const totalItems = result.count
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
