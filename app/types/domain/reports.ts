export type ReportTabId = 'personnel' | 'equipment'

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface ReportSummaryMetric {
  label: string
  value: string
  description: string
}

export interface ReportPrintableSection {
  title: string
  rows: readonly ReportSummaryMetric[]
}

export interface ReportPersonnelChartGroups {
  serviceStatus: ChartDataPoint[]
  battalions: ChartDataPoint[]
  companies: ChartDataPoint[]
  sex: ChartDataPoint[]
  timeline: ChartDataPoint[]
}
