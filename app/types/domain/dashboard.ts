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
