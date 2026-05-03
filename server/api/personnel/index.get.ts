import { createError, defineEventHandler, getQuery } from 'h3'
import type { PersonnelListResponse } from '../../shared/models'
import { PERSONNEL_PERMISSION_GROUPS, PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'
import { mapPersonnelListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchPersonnelList } from '../../utils/personnel/fetchPersonnelList'

export default defineEventHandler(async (event): Promise<PersonnelListResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const { data, count, error } = await fetchPersonnelList(supabase, { search, rangeFrom, rangeTo })

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
