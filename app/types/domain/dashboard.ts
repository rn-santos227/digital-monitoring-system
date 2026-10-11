export interface DashboardParameters {
  personnelLimit: number
  equipmentLimit: number
  deploymentLimit: number
  itemLimit: number
}

export type DashboardKpiId = Exclude<keyof DashboardTopKpis, 'asOf'>
export type DashboardPersonnelValueId = keyof DashboardStatusCountSummary
export type DashboardEquipmentValueId = keyof DashboardEquipmentStatusSummary
export type DashboardOperationalValueId = keyof DashboardOperationalTimeMetric
export type DashboardWidgetId =
  | 'topKpis'
  | 'personnelDeploymentSummary'
  | 'equipmentStatusOverview'
  | 'criticalPersonnel'
  | 'criticalEquipment'
  | 'nearRotation'
  | 'locationLoadAnalysis'
  | 'personnelDeploymentHistory'
  | 'operationalTimeMonitoring'

export interface DashboardDisplaySettings {
  kpis: DashboardKpiId[]
  personnelValues: DashboardPersonnelValueId[]
  equipmentValues: DashboardEquipmentValueId[]
  operationalValues: DashboardOperationalValueId[]
  widgets: DashboardWidgetId[]
}

export interface DashboardConfiguration {
  parameters: DashboardParameters
  display: DashboardDisplaySettings
}

export interface DashboardData {
  topKpis: DashboardTopKpis
  personnelDeploymentSummary: DashboardPersonnelDeploymentSummary
  equipmentStatusOverview: DashboardEquipmentStatusOverview
  criticalPersonnel: DashboardCriticalPersonnel
  criticalEquipment: DashboardCriticalEquipment
  nearRotation: DashboardNearRotation
  locationLoadAnalysis: DashboardLocationLoadAnalysis
  personnelDeploymentHistory: DashboardPersonnelDeploymentHistory
  operationalTimeMonitoring: DashboardOperationalTimeMonitoring
}

export interface DashboardLoadResult {
  data: DashboardData
  errors: Partial<Record<DashboardWidgetId, string>>
}

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

export interface DashboardTopKpis {
  asOf: string
  totalRegistered: number
  deployed: number
  standbyAlert: number
  noComms: number
  injuredOrDead: number
}

export interface DashboardPersonnelDeploymentSummary {
  asOf: string
  summary: DashboardStatusCountSummary
}

export interface DashboardEquipmentStatusOverview {
  asOf: string
  summary: DashboardEquipmentStatusSummary
}

export interface DashboardLocationLoadAnalysis {
  asOf: string
  items: DashboardLocationLoadItem[]
}

export interface DashboardPersonnelDeploymentHistory {
  asOf: string
  items: DashboardDeploymentHistoryItem[]
}

export interface DashboardCriticalPersonnel {
  asOf: string
  items: DashboardCriticalPersonnelItem[]
}

export interface DashboardCriticalEquipment {
  asOf: string
  items: DashboardCriticalEquipmentItem[]
}

export interface DashboardNearRotation {
  asOf: string
  items: DashboardRotationAlertItem[]
}

export interface DashboardOperationalTimeMetric {
  activeDeploymentCount: number
  averageActiveDays: number
  longestActiveDays: number
}

export interface DashboardOperationalTimeMonitoring {
  asOf: string
  metric: DashboardOperationalTimeMetric
}
