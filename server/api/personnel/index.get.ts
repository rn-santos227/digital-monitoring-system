import { createError, defineEventHandler, getQuery } from 'h3'
import type { PersonnelListResponse } from '../../shared/models'
import { PERSONNEL_PERMISSION_GROUPS, PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'
import { mapPersonnelListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<PersonnelListResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  let personnelQuery = supabase
    .from('vw_personnel_profile')
    .select(PERSONNEL_PROFILE_LIST_SELECT_COLUMNS, {
      count: 'exact',
    })
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    personnelQuery = personnelQuery.or([
      `personnel_code.ilike.%${search}%`,
      `service_number.ilike.%${search}%`,
      `last_name.ilike.%${search}%`,
      `first_name.ilike.%${search}%`,
    ].join(','))
  }

  const { data, count, error } = await personnelQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch personnel records: ${error.message}` })
  }

  const items = (data ?? []).map(mapPersonnelListItem)
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
