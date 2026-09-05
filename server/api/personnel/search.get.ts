import { createError, defineEventHandler, getQuery } from 'h3'
import type { PersonnelListCompactResponse } from '../../shared/responses'
import { PERSONNEL_PERMISSION_GROUPS, PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'
import { mapPersonnelCompactListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validations'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { buildPersonnelAdvancedSearchFilters } from '../../utils/personnel/buildPersonnelAdvancedSearchFilters'
import { buildPersonnelSearchFilters } from '../../utils/personnel/buildPersonnelSearchFilters'
import { searchPersonnel } from '../../utils/personnel/searchPersonnel'


export default defineEventHandler(async (event): Promise<PersonnelListCompactResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const serializedConditions = typeof query.conditions === 'string' ? query.conditions : ''

  if (!term && !serializedConditions) {
    throw createError({ statusCode: 400, statusMessage: 'Search term is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const advancedConditions = parsePersonnelAdvancedSearchConditions(serializedConditions)

  const filters = Array.isArray(advancedConditions) && advancedConditions.length
    ? buildPersonnelAdvancedSearchFilters(advancedConditions)
    : buildPersonnelSearchFilters(term, typeof query.fields === 'string' ? query.fields : undefined)

  if (filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const match = query.match === 'any' ? 'any' : 'all'
  const { data, count, error } = await searchPersonnel(supabase, { filters, match, rangeFrom, rangeTo })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search personnel records: ${error.message}` })
  }

  const items = (data ?? []).map(mapPersonnelCompactListItem)
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
