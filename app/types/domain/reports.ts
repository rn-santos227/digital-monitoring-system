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

export interface ReportEquipmentChartGroups {
  assetStatus: ChartDataPoint[]
  serviceability: ChartDataPoint[]
  items: ChartDataPoint[]
  locations: ChartDataPoint[]
  timeline: ChartDataPoint[]
}

export interface ReportPersonnelMetrics {
  totalRecords: number
  battalionsRepresented: number
  companiesRepresented: number
}

export interface ReportEquipmentMetrics {
  totalAssets: number
  totalItems: number
  trackedLocations: number
}

export interface ReportChartsResponse {
  asOf: string
  personnel: {
    metrics: ReportPersonnelMetrics
    charts: ReportPersonnelChartGroups
  }
  equipment: {
    metrics: ReportEquipmentMetrics
    charts: ReportEquipmentChartGroups
  }
}
