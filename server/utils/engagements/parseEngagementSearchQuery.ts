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


}
