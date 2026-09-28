import { describe, expect, it } from 'vitest'

import {
  REPORT_PERSONNEL_CHART_SELECT_COLUMNS,
  REPORT_PERSONNEL_CHART_SOURCE,
} from '../../../../server/shared/constants/lib/reports'

describe('report personnel chart source', () => {
  it('uses the personnel profile view for resolved lookup names', () => {
    expect(REPORT_PERSONNEL_CHART_SOURCE).toBe('vw_personnel_profile')
    expect(REPORT_PERSONNEL_CHART_SELECT_COLUMNS.split(', ')).toEqual([
      'id',
      'service_status',
      'battalion_name',
      'company_name',
      'sex',
      'created_at',
    ])
  })
})
