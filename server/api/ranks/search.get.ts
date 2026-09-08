import { createError, defineEventHandler, getQuery } from 'h3'
import type { RankListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES, RANK_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import { mapRankListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validations'
import { requirePermission } from '../../utils/auth/requirePermission'
import { buildPersonnelAdvancedSearchFilters } from '../../utils/personnel/buildPersonnelAdvancedSearchFilters'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchRank } from '../../utils/ranks/searchRank'

export default defineEventHandler(async (event): Promise<RankListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.personnelView)

  const query = getQuery(event)
  const serializedConditions = typeof query.conditions === 'string' ? query.conditions : ''

  if (!serializedConditions) {
    throw createError({ statusCode: 400, statusMessage: 'Advanced search conditions are required.' })
  }

  const advancedFilters = buildPersonnelAdvancedSearchFilters(
    parsePersonnelAdvancedSearchConditions(serializedConditions),
    RANK_SEARCHABLE_FIELD_COLUMNS,
  )

  if (advancedFilters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })
  const supabase = getServiceSupabaseClient()
  const result = await searchRank(supabase, {
    filters: advancedFilters,
    rangeFrom,
    rangeTo,
    match: query.match === 'any' ? 'any' : 'all',
  })
})
