import { describe, expect, it } from 'vitest'

import {
  ACCOUNT_TYPE_SEARCHABLE_FIELD_COLUMNS,
  USER_PROFILE_SEARCHABLE_FIELD_COLUMNS,
} from '../../../../server/shared/constants'
import { buildPersonnelAdvancedSearchFilters } from '../../../../server/utils/personnel/buildPersonnelAdvancedSearchFilters'

describe('user management advanced search filters', () => {
  it('builds an inclusive created date range for user profiles', () => {
    const filters = buildPersonnelAdvancedSearchFilters([{
      field: 'createdAt',
      operator: 'between',
      value: '2026-09-04',
      valueTo: '2026-09-05',
    }], USER_PROFILE_SEARCHABLE_FIELD_COLUMNS)

    expect(filters).toEqual([
      {
        column: 'created_at',
        operator: 'gte',
        value: '2026-09-04T00:00:00.000Z',
        conditionGroup: 'condition-0',
        groupMatch: 'all',
      },
      {
        column: 'created_at',
        operator: 'lte',
        value: '2026-09-05T23:59:59.999Z',
        conditionGroup: 'condition-0',
        groupMatch: 'all',
      },
    ])
  })
})
