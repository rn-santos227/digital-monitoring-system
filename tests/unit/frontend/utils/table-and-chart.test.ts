import { describe, expect, it } from 'vitest'

import {
  resolveDataTableAlignClass,
  resolveDataTableRowKey,
  resolvePaginationPages,
} from '@/app/utils/data-table'
import {
  groupRecordsByMonth,
  groupRecordsByStringValue,
  limitChartData,
  sumChartValues,
  toPercent,
} from '@/app/utils/chart-data'
import {
  buildReportMonthChart,
  buildReportStringChart,
  isReportDateInRange,
  limitReportChartData,
} from '@/server/shared/utils/reports'

describe('table display helpers', () => {
  it('uses stable explicit ids and falls back to the row content', () => {
    expect(resolveDataTableRowKey({ id: 0 }, 'id')).toBe('0')
    expect(resolveDataTableRowKey({ id: false }, 'id')).toBe('false')
    expect(resolveDataTableRowKey({ id: null }, 'id')).toBe('{"id":null}')
    expect(resolveDataTableRowKey({ name: 'Jane' }, 'id')).toBe(
      '{"name":"Jane"}',
    )
  })

  it.each([
    ['center', 'text-center'],
    ['right', 'text-right'],
    ['left', 'text-left'],
    [undefined, 'text-left'],
  ] as const)('maps alignment %s', (align, expected) => {
    expect(resolveDataTableAlignClass(align)).toBe(expected)
  })

  it.each([
    [1, 0, 5, []],
    [1, 10, 5, [1, 2, 3, 4, 5]],
    [5, 10, 5, [3, 4, 5, 6, 7]],
    [10, 10, 5, [6, 7, 8, 9, 10]],
    [99, 3, 5, [1, 2, 3]],
    [-1, 3, 0, [1]],
  ])(
    'creates a pagination window for page %s of %s',
    (page, total, visible, expected) => {
      expect(resolvePaginationPages(page, total, visible)).toEqual(expected)
    },
  )
})

describe.each([
  ['frontend', groupRecordsByStringValue, groupRecordsByMonth, limitChartData],
  [
    'server',
    buildReportStringChart,
    buildReportMonthChart,
    limitReportChartData,
  ],
] as const)('%s chart aggregation', (_name, group, month, limit) => {
  it('trims categories, groups missing values, and sorts by count then label', () => {
    const data = group(
      [' Alpha ', 'Beta', 'Alpha', null, '', 'Gamma'],
      (value) => value,
      'Missing',
    )
    expect(data.map(({ label, value }) => ({ label, value }))).toEqual([
      { label: 'Alpha', value: 2 },
      { label: 'Missing', value: 2 },
      { label: 'Beta', value: 1 },
      { label: 'Gamma', value: 1 },
    ])
    expect(data.every((item) => item.color)).toBe(true)
    expect(group([], (value) => value)).toEqual([])
  })

  it('preserves visible categories and combines the remaining values without mutation', () => {
    const data = [
      { label: 'A', value: 4, color: 'red' },
      { label: 'B', value: 3, color: 'blue' },
      { label: 'C', value: 2, color: 'green' },
    ]
    expect(limit(data, 1, 'Remaining')).toEqual([
      data[0],
      expect.objectContaining({ label: 'Remaining', value: 5 }),
    ])
    expect(limit(data, 3)).toEqual(data)
    expect(limit(data, 3)).not.toBe(data)
    expect(data).toHaveLength(3)
  })

  it('sorts month buckets chronologically and keeps unknown dates last', () => {
    const data = month(
      ['2026-03-01', '2026-01-15', null, 'invalid', '2026-01-10'],
      (value) => value,
    )
    expect(data.map((item) => item.value)).toEqual([2, 1, 2])
    expect(data.at(-1)?.label).toBe('Unknown month')
    expect(month([], (value) => value)).toEqual([])
  })
})

describe('chart and report numeric boundaries', () => {
  it('sums values and avoids division by zero', () => {
    expect(
      sumChartValues([
        { label: 'A', value: 3, color: 'red' },
        { label: 'B', value: 2, color: 'blue' },
      ]),
    ).toBe(5)
    expect(sumChartValues([])).toBe(0)
    expect(toPercent(1, 3)).toBe(33)
    expect(toPercent(1, 0)).toBe(0)
    expect(toPercent(1, -1)).toBe(0)
  })

  it('filters inclusive dates and handles missing dates only for unbounded reports', () => {
    expect(isReportDateInRange(null, {})).toBe(true)
    expect(isReportDateInRange(undefined, { dateFrom: '2026-01-01' })).toBe(
      false,
    )
    expect(
      isReportDateInRange('2026-01-01T12:00:00Z', {
        dateFrom: '2026-01-01',
        dateTo: '2026-01-01',
      }),
    ).toBe(true)
    expect(isReportDateInRange('2025-12-31', { dateFrom: '2026-01-01' })).toBe(
      false,
    )
    expect(isReportDateInRange('2026-01-02', { dateTo: '2026-01-01' })).toBe(
      false,
    )
  })
})
