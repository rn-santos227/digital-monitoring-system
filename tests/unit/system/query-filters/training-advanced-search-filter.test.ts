import { describe, expect, it } from 'vitest'

import {
  TRAINING_CATEGORY_SEARCHABLE_FIELD_COLUMNS,
  TRAINING_RECORD_SEARCHABLE_FIELD_COLUMNS,
  TRAINING_SEARCHABLE_FIELD_COLUMNS,
} from '../../../../server/shared/constants'
import { buildPersonnelAdvancedSearchFilters } from '../../../../server/utils/personnel/buildPersonnelAdvancedSearchFilters'

describe('training management advanced search filters', () => {
  it('builds training title and remarks conditions', () => {
    const filters = buildPersonnelAdvancedSearchFilters([
      {
        field: 'trainingTitle',
        operator: 'startsWith',
        value: 'Field',
      },
      {
        field: 'defaultRemarks',
        operator: 'contains',
        value: 'readiness',
      },
    ], TRAINING_SEARCHABLE_FIELD_COLUMNS)

    expect(filters).toEqual([
      {
        column: 'training_title',
        operator: 'ilike',
        value: 'Field%',
        conditionGroup: 'condition-0',
      },
      {
        column: 'default_remarks',
        operator: 'ilike',
        value: '%readiness%',
        conditionGroup: 'condition-1',
      },
    ])
  })

  it('builds an inclusive training audit timestamp range', () => {
    const filters = buildPersonnelAdvancedSearchFilters([{
      field: 'createdAt',
      operator: 'between',
      value: '2026-09-01',
      valueTo: '2026-09-03',
    }], TRAINING_SEARCHABLE_FIELD_COLUMNS)

    expect(filters.map(filter => [filter.column, filter.operator, filter.value])).toEqual([
      ['created_at', 'gte', '2026-09-01T00:00:00.000Z'],
      ['created_at', 'lte', '2026-09-03T23:59:59.999Z'],
    ])
    expect(filters.every(filter => filter.groupMatch === 'all')).toBe(true)
  })

  it('builds training record certificate and validity conditions', () => {
    const filters = buildPersonnelAdvancedSearchFilters([
      {
        field: 'certificateNo',
        operator: 'equals',
        value: 'CERT-001, CERT-002',
      },
      {
        field: 'validUntil',
        operator: 'between',
        value: '2027-01-01',
        valueTo: '2027-12-31',
      },
    ], TRAINING_RECORD_SEARCHABLE_FIELD_COLUMNS)

    expect(filters).toHaveLength(4)
    expect(filters.slice(0, 2).map(filter => [filter.column, filter.operator, filter.value])).toEqual([
      ['certificate_no', 'eq', 'CERT-001'],
      ['certificate_no', 'eq', 'CERT-002'],
    ])
    expect(filters.slice(2).map(filter => [filter.column, filter.operator, filter.value])).toEqual([
      ['valid_until', 'gte', '2027-01-01'],
      ['valid_until', 'lte', '2027-12-31'],
    ])
  })

  it('builds training category name and updated timestamp conditions', () => {
    const filters = buildPersonnelAdvancedSearchFilters([
    ], TRAINING_CATEGORY_SEARCHABLE_FIELD_COLUMNS)
  })
})
