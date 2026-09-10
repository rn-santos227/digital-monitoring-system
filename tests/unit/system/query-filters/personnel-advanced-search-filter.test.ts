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
    }])).toEqual([

    ])
  })
})
