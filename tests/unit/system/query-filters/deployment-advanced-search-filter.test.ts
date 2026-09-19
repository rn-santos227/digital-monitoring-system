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

  })
}
