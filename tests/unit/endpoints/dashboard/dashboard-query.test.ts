import { describe, expect, it } from 'vitest'

import {
  DEFAULT_DASHBOARD_PARAMETERS,
  DASHBOARD_PARAMETER_LIMITS,
} from '@/server/shared/constants/lib/dashboard'
import { parseDashboardParameters } from '@/server/shared/validation/domain/dashboard'

describe('dashboard parameter parsing', () => {
  it('uses independent defaults for absent, invalid, and empty array parameters', () => {
    expect(parseDashboardParameters({})).toEqual(DEFAULT_DASHBOARD_PARAMETERS)
    expect(
      parseDashboardParameters({
        personnelLimit: [],
        equipmentLimit: 'bad',
        deploymentLimit: Infinity,
      }),
    ).toEqual(DEFAULT_DASHBOARD_PARAMETERS)
  })

  it('normalizes query arrays, truncates numeric values, and enforces upper and lower limits', () => {
    expect(
      parseDashboardParameters({
        personnelLimit: ['12', '99'],
        equipmentLimit: 8.8,
        deploymentLimit: -2,
        itemLimit: 999999,
      }),
    ).toEqual({
      personnelLimit: 12,
      equipmentLimit: 8,
      deploymentLimit: DASHBOARD_PARAMETER_LIMITS.minimum,
      itemLimit: DASHBOARD_PARAMETER_LIMITS.maximumItemLimit,
    })
    expect(
      parseDashboardParameters({ personnelLimit: 999999 }).personnelLimit,
    ).toBe(DASHBOARD_PARAMETER_LIMITS.maximumRecordLimit)
  })
})
