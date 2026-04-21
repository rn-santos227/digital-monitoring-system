import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { PersonnelTrainingRecordListResponse } from '../../../shared/responses'
import {
  ID_ONLY_SELECT_COLUMNS,
  PERSONNEL_PERMISSION_GROUPS,
  PERSONNEL_TRAINING_RECORD_LIST_SELECT_COLUMNS,
} from '../../../shared/constants'
import {
  assertPersonnelExists,
  mapPersonnelTrainingRecordListItem,
  parseManagementPaginationQuery,
} from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<PersonnelTrainingRecordListResponse> => {
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

  const { data, count, error } = await supabase
    .from('training_records')
    .select(PERSONNEL_TRAINING_RECORD_LIST_SELECT_COLUMNS, {
      count: 'exact',
    })
    .eq('personnel_id', personnelId)
    .order('start_date', { ascending: false })
    .order('created_at', { ascending: false })
    .range(rangeFrom, rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch personnel training records: ${error.message}` })
  }

  const items = (data ?? []).map(mapPersonnelTrainingRecordListItem)
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
