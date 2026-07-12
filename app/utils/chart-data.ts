import type { ChartDataPoint } from '~/types/domain/reports'

export const CHART_DEFAULT_COLORS = Object.freeze([
  '#0f766e',
  '#2563eb',
  '#7c3aed',
  '#ea580c',
  '#dc2626',
  '#0891b2',
])

export const groupRecordsByStringValue = <TItem>(
  items: readonly TItem[],
  resolveValue: (item: TItem) => string | null | undefined,
  fallbackLabel = 'Not specified',
): ChartDataPoint[] => {


}
