import { defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { BattalionCompanyListResponse } from '../../../shared/responses'
import { ID_ONLY_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../../shared/constants'
import {
  assertBattalionExists,
  mapCompanyListItem,
  parseManagementPaginationQuery,
} from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchBattalionCompanies } from '../../../utils/battalions/FetchBattalionCompanies'

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

  const { rows, totalItems } = await fetchBattalionCompanies(supabase, {
    battalionId,
    includeInactive,
    search,
    rangeFrom,
    rangeTo,
  })

  const items = rows.map(mapCompanyListItem)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
  }
})
