import { createError } from 'h3'
import { ENGAGEMENT_RECORD_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import { parseManagementPaginationQuery } from '../../shared/utils'
import type {
  EngagementRecordSearchQuery,
  ParsedEngagementRecordSearchQuery,
} from '../../shared/utils/engagement-management'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validations'
import { buildPersonnelAdvancedSearchFilters } from '../personnel/buildPersonnelAdvancedSearchFilters'


