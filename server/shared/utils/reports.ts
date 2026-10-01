import {
  REPORT_CHART_DEFAULT_COLORS,
  REPORT_TOP_CATEGORY_LIMIT,
} from '../constants'
import type { ReportChartDataPoint } from '../responses'

export interface ReportPersonnelChartRow {
  service_status: string | null
  battalion_name: string | null
  company_name: string | null
  sex: string | null
  created_at: string | null
}

interface ReportReferenceRow {
  name?: string | null
}

export interface ReportEquipmentAssetChartRow {
  current_location: string | null
  procurement_date: string | null
  created_at: string | null
  equipment_item: ReportReferenceRow | ReportReferenceRow[] | null
  serviceability_status: ReportReferenceRow | ReportReferenceRow[] | null
  asset_status: ReportReferenceRow | ReportReferenceRow[] | null
}

export interface ReportDateRange {
  dateFrom?: string
  dateTo?: string
}

export const isReportDateInRange = (
  value: string | null | undefined,
  range: ReportDateRange,
): boolean => {


}

const getChartColor = (index: number): string => {
  return REPORT_CHART_DEFAULT_COLORS[index % REPORT_CHART_DEFAULT_COLORS.length] ?? REPORT_CHART_DEFAULT_COLORS[0]
}

const toReferenceName = (value: ReportReferenceRow | ReportReferenceRow[] | null | undefined): string | null => {
  const row = Array.isArray(value) ? (value[0] ?? null) : (value ?? null)
  return row?.name ?? null
}

export const buildReportStringChart = <TItem>(
  items: readonly TItem[],
  resolveValue: (item: TItem) => string | null | undefined,
  fallbackLabel = 'Not specified',
): ReportChartDataPoint[] => {
  const counts = new Map<string, number>()

  for (const item of items) {
    const label = resolveValue(item)?.trim() || fallbackLabel
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([label, value], index) => ({
      label,
      value,
      color: getChartColor(index),
    }))
    .sort((left, right) => right.value - left.value || left.label.localeCompare(right.label))
}

export const limitReportChartData = (
  data: readonly ReportChartDataPoint[],
  maximumItems = REPORT_TOP_CATEGORY_LIMIT,
  otherLabel = 'Other',
): ReportChartDataPoint[] => {
  if (data.length <= maximumItems) {
    return [...data]
  }

  const visibleItems = data.slice(0, maximumItems)
  const hiddenTotal = data.slice(maximumItems).reduce((total, item) => total + item.value, 0)

  return [
    ...visibleItems,
    {
      label: otherLabel,
      value: hiddenTotal,
      color: getChartColor(maximumItems),
    },
  ]
}

export const buildReportMonthChart = <TItem>(
  items: readonly TItem[],
  resolveValue: (item: TItem) => string | null | undefined,
  fallbackLabel = 'Unknown month',
): ReportChartDataPoint[] => {
  const counts = new Map<string, number>()

  for (const item of items) {
    const rawValue = resolveValue(item)
    const parsedDate = rawValue ? new Date(rawValue) : null
    const label = parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
      : fallbackLabel

    counts.set(label, (counts.get(label) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([label, value], index) => ({
      label,
      value,
      color: getChartColor(index),
    }))
    .sort((left, right) => {
      if (left.label === fallbackLabel) return 1
      if (right.label === fallbackLabel) return -1
      return new Date(left.label).getTime() - new Date(right.label).getTime()
    })
}

export const getReportEquipmentItemName = (row: ReportEquipmentAssetChartRow): string | null => {
  return toReferenceName(row.equipment_item)
}

export const getReportEquipmentServiceabilityName = (row: ReportEquipmentAssetChartRow): string | null => {
  return toReferenceName(row.serviceability_status)
}

export const getReportEquipmentAssetStatusName = (row: ReportEquipmentAssetChartRow): string | null => {
  return toReferenceName(row.asset_status)
}
