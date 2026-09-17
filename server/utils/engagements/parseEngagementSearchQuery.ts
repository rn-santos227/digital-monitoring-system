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
}
