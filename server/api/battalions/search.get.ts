import { createError, defineEventHandler, getQuery } from 'h3'
import type { BattalionListResponse } from '../../shared/responses'
import { BATTALION_SEARCHABLE_FIELD_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapBattalionListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validation'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { buildPersonnelAdvancedSearchFilters } from '../../utils/personnel/buildPersonnelAdvancedSearchFilters'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchBattalions } from '../../utils/battalions/searchBattalions'

export default defineEventHandler(async (event): Promise<BattalionListResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.battalionManagement)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const serializedConditions = typeof query.conditions === 'string' ? query.conditions : ''
  const isActive = query.isActive === 'true' ? true : query.isActive === 'false' ? false : null

  if (!term && !serializedConditions && typeof isActive !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required (term or isActive).' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const searchFilters: string[] = []
  const advancedFilters = buildPersonnelAdvancedSearchFilters(parsePersonnelAdvancedSearchConditions(serializedConditions), BATTALION_SEARCHABLE_FIELD_COLUMNS)
  if (serializedConditions && advancedFilters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid advanced search conditions were provided.' })
  }

  if (term) {
    const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
    const selectedFields = rawFields.length > 0
      ? rawFields.filter((field): field is keyof typeof BATTALION_SEARCHABLE_FIELD_COLUMNS => field in BATTALION_SEARCHABLE_FIELD_COLUMNS)
      : Object.keys(BATTALION_SEARCHABLE_FIELD_COLUMNS) as Array<keyof typeof BATTALION_SEARCHABLE_FIELD_COLUMNS>

    for (const field of selectedFields) {
      searchFilters.push(`${BATTALION_SEARCHABLE_FIELD_COLUMNS[field]}.ilike.%${term}%`)
    }

    if (searchFilters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
    }
  }

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await searchBattalions(supabase, {
    searchFilters,
    advancedFilters,
    match: query.match === 'any' ? 'any' : 'all',
    isActive,
    rangeFrom,
    rangeTo,
  })

  const items = rows.map(mapBattalionListItem)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
