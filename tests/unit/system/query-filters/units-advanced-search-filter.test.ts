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


  })
})
