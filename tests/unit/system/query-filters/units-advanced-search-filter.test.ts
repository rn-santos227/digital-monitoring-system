import { describe, expect, it } from 'vitest'

import {
  BATTALION_SEARCHABLE_FIELD_COLUMNS,
  COMPANY_SEARCHABLE_FIELD_COLUMNS,
} from '../../../../server/shared/constants'
import { buildPersonnelAdvancedSearchFilters } from '../../../../server/utils/personnel/buildPersonnelAdvancedSearchFilters'

describe('unit management advanced search filters', () => {
  it.each([
    ['battalion', BATTALION_SEARCHABLE_FIELD_COLUMNS],
    ['company', COMPANY_SEARCHABLE_FIELD_COLUMNS],
  ] as const)('builds an inclusive updated date range for a %s', (_unit, searchableFields) => {
    const filters = buildPersonnelAdvancedSearchFilters([{
      field: 'updatedAt',
      operator: 'between',
      value: '2026-07-10',
      valueTo: '2026-07-12',
    }], searchableFields)

    expect(filters).toHaveLength(2)
    expect(filters[0]).toMatchObject({
      column: 'updated_at',
      operator: 'gte',
      value: '2026-07-10T00:00:00.000Z',
      groupMatch: 'all',
    })
  })
})
