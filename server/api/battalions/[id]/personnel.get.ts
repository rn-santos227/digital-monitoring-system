import { defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { BattalionPersonnelListResponse } from '../../../shared/responses'
import { ID_ONLY_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../../shared/constants'
import { assertBattalionExists, mapUnitPersonnelListItem, parseManagementPaginationQuery } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validation'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchBattalionPersonnel } from '../../../utils/battalions/fetchBattalionPersonnel'

export default defineEventHandler(async (event): Promise<BattalionPersonnelListResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.battalionManagement)

  const battalionId = requireRouteId(getRouterParam(event, 'id'), 'Battalion id is required.')
  const query = getQuery(event)
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

  const { rows, totalItems } = await fetchBattalionPersonnel(supabase, {
    battalionId,
    search,
    rangeFrom,
    rangeTo,
  })

  const items = rows.map(mapUnitPersonnelListItem)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
  }
})
