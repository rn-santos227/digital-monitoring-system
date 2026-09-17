import { createError } from 'h3'
import { ENGAGEMENT_RECORD_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import { parseManagementPaginationQuery } from '../../shared/utils'
import type {
  EngagementRecordSearchQuery,
  ParsedEngagementRecordSearchQuery,
} from '../../shared/utils/engagement-management'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validations'
import { buildPersonnelAdvancedSearchFilters } from '../personnel/buildPersonnelAdvancedSearchFilters'

export const parseEngagementRecordSearchQuery = (
  query: EngagementRecordSearchQuery,
): ParsedEngagementRecordSearchQuery => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const serializedConditions = typeof query.conditions === 'string' ? query.conditions : ''
  const engagementId = typeof query.engagementId === 'string' && query.engagementId.length > 0
    ? query.engagementId
    : null
  const personnelId = typeof query.personnelId === 'string' && query.personnelId.length > 0
    ? query.personnelId
    : null
  const engagementTypeId = typeof query.engagementTypeId === 'string' && query.engagementTypeId.length > 0
    ? query.engagementTypeId
    : null
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0
    ? query.statusId
    : null
}
