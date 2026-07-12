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
  const counts = new Map<string, number>()

  for (const item of items) {
    const label = resolveValue(item)?.trim() || fallbackLabel
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([label, value], index) => ({
      label,
      value,
      color: CHART_DEFAULT_COLORS[index % CHART_DEFAULT_COLORS.length] ?? CHART_DEFAULT_COLORS[0],
    }))
    .sort((left, right) => right.value - left.value || left.label.localeCompare(right.label))
}

export const limitChartData = (
  data: readonly ChartDataPoint[],
  maximumItems: number,
  otherLabel = 'Other',
): ChartDataPoint[] => {
  if (data.length <= maximumItems) {
    return [...data]
  }


}
