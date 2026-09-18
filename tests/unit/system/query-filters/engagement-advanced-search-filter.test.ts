import { describe, expect, it } from 'vitest'

import {
  ENGAGEMENT_RECORD_SEARCHABLE_FIELD_COLUMNS,
  ENGAGEMENT_SEARCHABLE_FIELD_COLUMNS,
} from '../../../../server/shared/constants'
import { buildPersonnelAdvancedSearchFilters } from '../../../../server/utils/personnel/buildPersonnelAdvancedSearchFilters'
import { parseEngagementSearchQuery } from '../../../../server/utils/engagements/parseEngagementSearchQuery'
import { parseEngagementRecordSearchQuery } from '../../../../server/utils/engagement-records/parseEngagementRecordSearchQuery'

describe('engagement management advanced search filters', () => {
  it('builds engagement title and default remarks conditions', () => {
   const filters = buildPersonnelAdvancedSearchFilters(
      [
        { field: 'engagementTitle', operator: 'startsWith', value: 'Exercise' },
        { field: 'defaultRemarks', operator: 'contains', value: 'readiness' },
      ],
      ENGAGEMENT_SEARCHABLE_FIELD_COLUMNS,
    )

    expect(
      filters.map((filter) => [filter.column, filter.operator, filter.value]),
    ).toEqual([
      ['engagement_title', 'ilike', 'Exercise%'],
      ['default_remarks', 'ilike', '%readiness%'],
    ])
  })

  it('builds engagement record identifiers and date ranges', () => {
    const filters = buildPersonnelAdvancedSearchFilters(
      [
        { field: 'recordNo', operator: 'equals', value: 'ENG-001' },
        {
          field: 'startDate',
          operator: 'between',
          value: '2026-09-01',
          valueTo: '2026-09-15',
        },
      ],
      ENGAGEMENT_RECORD_SEARCHABLE_FIELD_COLUMNS,
    )

    expect(
      filters.map((filter) => [filter.column, filter.operator, filter.value]),
    ).toEqual([
      ['record_no', 'eq', 'ENG-001'],
      ['start_date', 'gte', '2026-09-01'],
      ['start_date', 'lte', '2026-09-15'],
    ])
  })

  it('ignores fields outside each engagement domain allowlist', () => {

  })
}
