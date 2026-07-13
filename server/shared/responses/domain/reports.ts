export interface ReportChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface ReportPersonnelChartGroups {
  serviceStatus: ReportChartDataPoint[]
  battalions: ReportChartDataPoint[]
  companies: ReportChartDataPoint[]
  sex: ReportChartDataPoint[]
  timeline: ReportChartDataPoint[]
}

export interface ReportEquipmentChartGroups {
  assetStatus: ReportChartDataPoint[]
  serviceability: ReportChartDataPoint[]
  items: ReportChartDataPoint[]
  locations: ReportChartDataPoint[]
  timeline: ReportChartDataPoint[]
}

export interface ReportPersonnelMetricsResponse {
  totalRecords: number
  battalionsRepresented: number
  companiesRepresented: number
}

export interface ReportEquipmentMetricsResponse {
  totalAssets: number
  totalItems: number
  trackedLocations: number
}

export interface ReportChartsResponse {
  asOf: string
  personnel: {
    metrics: ReportPersonnelMetricsResponse
    charts: ReportPersonnelChartGroups
  }
  equipment: {
    metrics: ReportEquipmentMetricsResponse
    charts: ReportEquipmentChartGroups
  }
}
