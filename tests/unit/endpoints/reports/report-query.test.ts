import { describe, expect, it } from 'vitest'

import { parseReportDateRangeQuery } from '@/server/shared/validation/domain/reports'

describe('report date range query', () => {
  it('accepts empty, one-sided, inclusive, and leap-year ranges', () => {
    expect(parseReportDateRangeQuery({ dateFrom: null, dateTo: '' })).toEqual({
      dateFrom: undefined,
      dateTo: undefined,
    })
    expect(parseReportDateRangeQuery({ dateFrom: '2024-02-29' })).toEqual({
      dateFrom: '2024-02-29',
      dateTo: undefined,
    })
    expect(parseReportDateRangeQuery({ dateTo: '2026-10-04' }).dateTo).toBe(
      '2026-10-04',
    )
    expect(
      parseReportDateRangeQuery({
        dateFrom: '2026-10-04',
        dateTo: '2026-10-04',
      }).dateFrom,
    ).toBe('2026-10-04')
  })

  it.each([
    '2026/01/01',
    '2026-02-29',
    '2026-04-31',
    '2026-13-01',
    '2026-00-01',
    '0000-00-00',
    1,
    ['2026-01-01'],
  ])('rejects invalid date %j for either boundary', (value) => {
    expect(() => parseReportDateRangeQuery({ dateFrom: value })).toThrow()
    expect(() => parseReportDateRangeQuery({ dateTo: value })).toThrow()
  })

  it('rejects an end date before the start date', () => {
    expect(() =>
      parseReportDateRangeQuery({
        dateFrom: '2026-10-04',
        dateTo: '2026-10-03',
      }),
    ).toThrow('End date must be on or after start date.')
  })
})
