export interface DashboardStatusCountSummary {
  deployed: number
  unavailable: number
  standbyAlert: number
  injured: number
  dead: number
}

export interface DashboardEquipmentStatusSummary {
  operational: number
  standbyReady: number
  partiallyOperational: number
  underMaintenance: number
  defective: number
}

export type DashboardLocationLoadLevel = 'light' | 'moderate' | 'heavy'

export interface DashboardLocationLoadItem {
  locationName: string
  totalPersonnel: number
  deployedPersonnel: number
  loadLevel: DashboardLocationLoadLevel
}

export interface DashboardDeploymentHistoryItem {
  personnelId: string
  fullName: string
  locationName: string
  statusName: string
  loggedAt: string
}

export interface DashboardCriticalPersonnelItem {
  personnelId: string
  fullName: string
  locationName: string
  issueCode: string
  issue: string
}

export interface DashboardCriticalEquipmentItem {
  equipmentAssetId: string
  assetTag: string
  itemName: string
  issue: string
}

export interface DashboardRotationAlertItem {
  personnelId: string
  fullName: string
  locationName: string
  endDate: string
  daysRemaining: number
}

export interface DashboardTopKpisResponse {
  asOf: string
  totalRegistered: number
  deployed: number
  standbyAlert: number
  noComms: number
  injuredOrDead: number
}

export interface DashboardPersonnelDeploymentSummaryResponse {
  asOf: string
  summary: DashboardStatusCountSummary
}

export interface DashboardEquipmentStatusOverviewResponse {
  asOf: string
  summary: DashboardEquipmentStatusSummary
}

export interface DashboardLocationLoadAnalysisResponse {
  asOf: string
  items: DashboardLocationLoadItem[]
}

export interface DashboardPersonnelDeploymentHistoryResponse {
  asOf: string
  items: DashboardDeploymentHistoryItem[]
}

export interface DashboardCriticalPersonnelResponse {
  asOf: string
  items: DashboardCriticalPersonnelItem[]
}

export interface DashboardCriticalEquipmentResponse {
  asOf: string
  items: DashboardCriticalEquipmentItem[]
}

export interface DashboardNearRotationResponse {
  asOf: string
  items: DashboardRotationAlertItem[]
}

export interface DashboardOperationalTimeMetric {
  activeDeploymentCount: number
  averageActiveDays: number
  longestActiveDays: number
}

export interface DashboardOperationalTimeMonitoringResponse {
  asOf: string
  metric: DashboardOperationalTimeMetric
}
