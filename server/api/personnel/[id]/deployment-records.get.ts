import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { PersonnelDeploymentRecordListResponse } from '../../../shared/responses'
import type { PersonnelDeploymentRecordListRow } from '../../../shared/models'
import {
  ID_ONLY_SELECT_COLUMNS,
  PERSONNEL_DEPLOYMENT_RECORD_LIST_SELECT_COLUMNS,
  PERSONNEL_PERMISSION_GROUPS,
} from '../../../shared/constants'
import {
  assertPersonnelExists,
  mapPersonnelDeploymentRecordListItem,
  parseManagementPaginationQuery,
} from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchPersonnelRecordListTyped } from '../../../utils/personnel/fetchPersonnelRecordList'

export default defineEventHandler(async (event): Promise<PersonnelDeploymentRecordListResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)

  const personnelId = requireRouteId(getRouterParam(event, 'id'), 'Personnel id is required.')
  const query = getQuery(event)
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  await assertPersonnelExists({
    supabase,
    personnelId,
    idSelectColumns: ID_ONLY_SELECT_COLUMNS,
  })

  const { data, count, error } = await fetchPersonnelRecordListTyped<PersonnelDeploymentRecordListRow>(supabase, {
    table: 'deployment_records',
    selectColumns: PERSONNEL_DEPLOYMENT_RECORD_LIST_SELECT_COLUMNS,
    matchField: 'personnel_id',
    matchValue: personnelId,
    orderFields: [{ column: 'start_date', ascending: false }, { column: 'created_at', ascending: false }],
    rangeFrom,
    rangeTo,
  })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch personnel deployment records: ${error.message}` })
  }

  const items = (data ?? []).map(mapPersonnelDeploymentRecordListItem)
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
