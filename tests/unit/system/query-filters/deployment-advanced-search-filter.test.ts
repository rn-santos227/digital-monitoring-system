import { describe, expect, it } from 'vitest'

import {
  DEPLOYMENT_RECORD_SEARCHABLE_FIELD_COLUMNS,
  DEPLOYMENT_SEARCHABLE_FIELD_COLUMNS,
} from '../../../../server/shared/constants'
import { parseDeploymentRecordSearchQuery } from '../../../../server/utils/deployment-records/parseDeploymentRecordSearchQuery'
import { parseDeploymentSearchQuery } from '../../../../server/utils/deployments/parseDeploymentSearchQuery'
import { buildPersonnelAdvancedSearchFilters } from '../../../../server/utils/personnel/buildPersonnelAdvancedSearchFilters'

describe('deployment management advanced search filters', () => {
  it('builds deployment operation and date conditions', () => {
    const filters = buildPersonnelAdvancedSearchFilters([
      { field: 'operationName', operator: 'contains', value: 'Sentinel' },
      { field: 'startDate', operator: 'between', value: '2026-09-01', valueTo: '2026-09-30' },
    ], DEPLOYMENT_SEARCHABLE_FIELD_COLUMNS)

    expect(filters.map(filter => [filter.column, filter.operator, filter.value])).toEqual([
      ['operation_name', 'ilike', '%Sentinel%'],
      ['start_date', 'gte', '2026-09-01'],
      ['start_date', 'lte', '2026-09-30'],
    ])
  })

  it('keeps deployment record fields isolated from deployment fields', () => {
    expect(buildPersonnelAdvancedSearchFilters([
      { field: 'recordNo', operator: 'equals', value: 'DEP-001' },
    ], DEPLOYMENT_SEARCHABLE_FIELD_COLUMNS)).toEqual([])

    expect(buildPersonnelAdvancedSearchFilters([
      { field: 'recordNo', operator: 'equals', value: 'DEP-001' },
    ], DEPLOYMENT_RECORD_SEARCHABLE_FIELD_COLUMNS)).toEqual([
      {
        column: 'record_no',
        operator: 'eq',
        value: 'DEP-001',
        conditionGroup: 'condition-0',
      },
    ])
  })

  it('prepares deployment API search parameters in utilities', () => {
   const conditions = JSON.stringify([
      { field: 'deploymentArea', operator: 'startsWith', value: 'North' },
    ])
    const deployment = parseDeploymentSearchQuery({ conditions, match: 'any', page: '2' })
    const record = parseDeploymentRecordSearchQuery({ conditions })

    expect(deployment.page).toBe(2)
    expect(deployment.match).toBe('any')
    expect(deployment.advancedFilters[0]).toMatchObject({
      column: 'deployment_area',
      operator: 'ilike',
      value: 'North%',
    })
    expect(record.match).toBe('all')
    expect(record.advancedFilters[0]?.column).toBe('deployment_area')
  })

  it('rejects empty deployment searches before querying the database', () => {
    expect(() => parseDeploymentSearchQuery({})).toThrow('At least one search filter is required.')
    expect(() => parseDeploymentRecordSearchQuery({})).toThrow('At least one search filter is required.')
  })
}
