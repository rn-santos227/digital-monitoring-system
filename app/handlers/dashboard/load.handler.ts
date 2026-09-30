import type { Ref } from 'vue'
import type {
  DashboardCriticalEquipment,
  DashboardCriticalPersonnel,
  DashboardEquipmentStatusOverview,
  DashboardLocationLoadAnalysis,
  DashboardNearRotation,
  DashboardOperationalTimeMonitoring,
  DashboardParameters,
  DashboardPersonnelDeploymentHistory,
  DashboardPersonnelDeploymentSummary,
  DashboardTopKpis,
} from '~/types/domain/dashboard'
import {
  getDashboardCriticalEquipmentEndpoint,
  getDashboardCriticalPersonnelEndpoint,
  getDashboardEquipmentStatusOverviewEndpoint,
  getDashboardLocationLoadAnalysisEndpoint,
  getDashboardNearRotationEndpoint,
  getDashboardOperationalTimeMonitoringEndpoint,
  getDashboardPersonnelDeploymentHistoryEndpoint,
  getDashboardPersonnelDeploymentSummaryEndpoint,
  getDashboardTopKpisEndpoint,
} from '~/utils/dashboard-endpoints'
import { readDashboardParameters } from '~/utils/dashboard-parameters-storage'

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

export const createInitialDashboardData = (): DashboardData => ({
  topKpis: { asOf: '', totalRegistered: 0, deployed: 0, standbyAlert: 0, noComms: 0, injuredOrDead: 0 },
  personnelDeploymentSummary: {
    asOf: '',
    summary: { deployed: 0, unavailable: 0, standbyAlert: 0, injured: 0, dead: 0 },
  },
  equipmentStatusOverview: {
    asOf: '',
    summary: { operational: 0, standbyReady: 0, partiallyOperational: 0, underMaintenance: 0, defective: 0 },
  },
  criticalPersonnel: { asOf: '', items: [] },
  criticalEquipment: { asOf: '', items: [] },
  nearRotation: { asOf: '', items: [] },
  locationLoadAnalysis: { asOf: '', items: [] },
  personnelDeploymentHistory: { asOf: '', items: [] },
  operationalTimeMonitoring: {
    asOf: '',
    metric: { activeDeploymentCount: 0, averageActiveDays: 0, longestActiveDays: 0 },
  },
})

export const loadDashboardData = async (parameters: DashboardParameters): Promise<DashboardData> => {
  const [
    topKpis,
    personnelDeploymentSummary,
    equipmentStatusOverview,
    criticalPersonnel,
    criticalEquipment,
    nearRotation,
    locationLoadAnalysis,
    personnelDeploymentHistory,
    operationalTimeMonitoring,
  ] = await Promise.all([
    getDashboardTopKpisEndpoint(parameters),
    getDashboardPersonnelDeploymentSummaryEndpoint(parameters),
    getDashboardEquipmentStatusOverviewEndpoint(parameters),
    getDashboardCriticalPersonnelEndpoint(parameters),
    getDashboardCriticalEquipmentEndpoint(parameters),
    getDashboardNearRotationEndpoint(parameters),
    getDashboardLocationLoadAnalysisEndpoint(parameters),
    getDashboardPersonnelDeploymentHistoryEndpoint(parameters),
    getDashboardOperationalTimeMonitoringEndpoint(parameters),
  ])

  return {
    topKpis,
    personnelDeploymentSummary,
    equipmentStatusOverview,
    criticalPersonnel,
    criticalEquipment,
    nearRotation,
    locationLoadAnalysis,
    personnelDeploymentHistory,
    operationalTimeMonitoring,
  }
}
