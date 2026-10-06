import { defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { CompanyPersonnelListResponse } from '../../../shared/responses'
import { ID_ONLY_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../../shared/constants'
import { assertCompanyExists, mapUnitPersonnelListItem, parseManagementPaginationQuery } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validation'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchCompanyPersonnel } from '../../../utils/companies/fetchCompanyPersonnel'

export default defineEventHandler(async (event): Promise<CompanyPersonnelListResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.companyManagement)

  const companyId = requireRouteId(getRouterParam(event, 'id'), 'Company id is required.')
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })

  const supabase = getServiceSupabaseClient()
  await assertCompanyExists({ supabase, companyId, idSelectColumns: ID_ONLY_SELECT_COLUMNS })

  const result = await fetchCompanyPersonnel(supabase, companyId, search, rangeFrom, rangeTo)
  const items = result.data.map(mapUnitPersonnelListItem)
  const totalPages = result.count === 0 ? 0 : Math.ceil(result.count / pageSize)

  return { items, page, pageSize, totalItems: result.count, totalPages }
})
