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

}
