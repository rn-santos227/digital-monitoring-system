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
  })
})
