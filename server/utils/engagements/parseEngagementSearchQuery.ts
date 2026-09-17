import { createError } from 'h3'
import { ENGAGEMENT_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import { parseManagementPaginationQuery } from '../../shared/utils'
import type {
  EngagementSearchQuery,
  ParsedEngagementSearchQuery,
} from '../../shared/utils/engagement-management'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validations'
import { buildPersonnelAdvancedSearchFilters } from '../personnel/buildPersonnelAdvancedSearchFilters'

export const parseEngagementSearchQuery = (
  query: EngagementSearchQuery,
): ParsedEngagementSearchQuery => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const serializedConditions = typeof query.conditions === 'string' ? query.conditions : ''
  const engagementCategoryId = typeof query.engagementCategoryId === 'string' && query.engagementCategoryId.length > 0
    ? query.engagementCategoryId
    : null
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0
    ? query.statusId
    : null

  if (!term && !serializedConditions && !engagementCategoryId && !statusId) {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })
  const rawFields = typeof query.fields === 'string'
    ? query.fields.split(',').map(field => field.trim())
    : []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is keyof typeof ENGAGEMENT_SEARCHABLE_FIELD_COLUMNS => field in ENGAGEMENT_SEARCHABLE_FIELD_COLUMNS)
    : Object.keys(ENGAGEMENT_SEARCHABLE_FIELD_COLUMNS) as Array<keyof typeof ENGAGEMENT_SEARCHABLE_FIELD_COLUMNS>
  const filters = term
    ? selectedFields.map(field => `${ENGAGEMENT_SEARCHABLE_FIELD_COLUMNS[field]}.ilike.%${term}%`)
    : []

  if (term && filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  const advancedFilters = buildPersonnelAdvancedSearchFilters(
    parsePersonnelAdvancedSearchConditions(serializedConditions),
    ENGAGEMENT_SEARCHABLE_FIELD_COLUMNS,
  )

  if (serializedConditions && advancedFilters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid advanced search conditions were provided.' })
  }

  return {
    page,
    pageSize,
    filters,
    advancedFilters,
    match: query.match === 'any' ? 'any' : 'all',
    engagementCategoryId,
    statusId,
    rangeFrom,
    rangeTo,
  }
}
