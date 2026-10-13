import { defineEventHandler, getQuery, getRouterParam } from 'h3'
import { ID_ONLY_SELECT_COLUMNS, PERSONNEL_PERMISSION_GROUPS } from '../../../../shared/constants'
import type { PersonnelHistoryResponse } from '../../../../shared/responses'
import { assertPersonnelExists, parseManagementPaginationQuery } from '../../../../shared/utils'
import { requireRouteId } from '../../../../shared/validation'
import { requireAnyPermission } from '../../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../../utils/auth/serviceClient'
import { fetchPersonnelHistory } from '../../../../utils/personnel-history/fetchPersonnelHistory'

export default defineEventHandler(async (event): Promise<PersonnelHistoryResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)
  const personnelId = requireRouteId(getRouterParam(event, 'id'), 'Personnel id is required.')
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery(getQuery(event))
  const supabase = getServiceSupabaseClient()
  await assertPersonnelExists({ supabase, personnelId, idSelectColumns: ID_ONLY_SELECT_COLUMNS })
  const result = await fetchPersonnelHistory(supabase, 'employment', personnelId, rangeFrom, rangeTo)
  return { ...result, page, pageSize, totalPages: result.totalItems === 0 ? 0 : Math.ceil(result.totalItems / pageSize) }
})
