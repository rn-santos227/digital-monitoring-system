import { describe, expect, it } from 'vitest'

import { buildPersonnelAdvancedSearchFilters } from '../../../../server/utils/personnel/buildPersonnelAdvancedSearchFilters'

describe('personnel advanced search filters', () => {
  it('creates a filter for every comma-separated specific value', () => {
    expect(buildPersonnelAdvancedSearchFilters([{
      field: 'serviceNumber',
      operator: 'contains',
      value: 'SIDC0777581, SIDC0777596',
    }])).toEqual([
      {
        column: 'service_number',
        operator: 'ilike',
        value: '%SIDC0777581%',
        conditionGroup: 'condition-0',
      },
      {
        column: 'service_number',
        operator: 'ilike',
        value: '%SIDC0777596%',
        conditionGroup: 'condition-0',
      },
    ])
  })

  it('ignores empty values and sanitizes filter grouping characters', () => {
    expect(buildPersonnelAdvancedSearchFilters([{
      field: 'lastName',
      operator: 'equals',
      value: ' Dela (Cruz),, Santos ',
    }])).toEqual([
      {
        column: 'last_name',
        operator: 'eq',
        value: 'Dela  Cruz',
        conditionGroup: 'condition-0',
      },
      {
        column: 'last_name',
        operator: 'eq',
        value: 'Santos',
        conditionGroup: 'condition-0',
      },
    ])
  })

  it('creates inclusive bounds for a between condition', () => {
    expect(buildPersonnelAdvancedSearchFilters([{
      field: 'createdAt',
      operator: 'between',
      value: '2026-09-04',
      valueTo: '2026-09-05',
    }])).toEqual([
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
