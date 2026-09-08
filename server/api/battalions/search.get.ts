import { createError, defineEventHandler, getQuery } from 'h3'
import type { BattalionListResponse } from '../../shared/responses'
import { BATTALION_SEARCHABLE_FIELD_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapBattalionListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validations'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { buildPersonnelAdvancedSearchFilters } from '../../utils/personnel/buildPersonnelAdvancedSearchFilters'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchBattalions } from '../../utils/battalions/searchBattalions'

const SEARCHABLE_FIELDS = {
  code: 'code',
  name: 'name',
} as const

export default defineEventHandler(async (event): Promise<BattalionListResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.battalionManagement)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const isActive = query.isActive === 'true' ? true : query.isActive === 'false' ? false : null

  if (!term && typeof isActive !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required (term or isActive).' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const searchFilters: string[] = []

  if (term) {
    const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
    const selectedFields = rawFields.length > 0
      ? rawFields.filter((field): field is keyof typeof SEARCHABLE_FIELDS => field in SEARCHABLE_FIELDS)
      : Object.keys(SEARCHABLE_FIELDS) as Array<keyof typeof SEARCHABLE_FIELDS>

    for (const field of selectedFields) {
      searchFilters.push(`${SEARCHABLE_FIELDS[field]}.ilike.%${term}%`)
    }

    if (searchFilters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
    }
  }

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await searchBattalions(supabase, {
    searchFilters,
    isActive,
    rangeFrom,
    rangeTo,
  })

  const items = rows.map(mapBattalionListItem)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
