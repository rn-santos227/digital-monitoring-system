import { describe, expect, it } from 'vitest'

import {
  ENGAGEMENT_RECORD_SEARCHABLE_FIELD_COLUMNS,
  ENGAGEMENT_SEARCHABLE_FIELD_COLUMNS,
} from '../../../../server/shared/constants'
import { buildPersonnelAdvancedSearchFilters } from '../../../../server/utils/personnel/buildPersonnelAdvancedSearchFilters'
import { parseEngagementSearchQuery } from '../../../../server/utils/engagements/parseEngagementSearchQuery'
import { parseEngagementRecordSearchQuery } from '../../../../server/utils/engagement-records/parseEngagementRecordSearchQuery'

describe('engagement management advanced search filters', () => {

}
