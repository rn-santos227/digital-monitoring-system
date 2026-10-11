import type {
  DashboardData,
  DashboardDisplaySettings,
  DashboardLoadResult,
  DashboardParameters,
  DashboardWidgetId,
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
import { extractApiErrorMessage } from '~/utils/api-request'
import {
  authorizeDashboardDisplay,
  isDashboardWidgetEnabled,
  normalizeDashboardDisplay,
} from '~/utils/dashboard-display'
export type { DashboardData } from '~/types/domain/dashboard'

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

export const loadDashboardData = async (
  parameters: DashboardParameters,
  display: DashboardDisplaySettings = normalizeDashboardDisplay(),
  permissions: readonly string[] = [],
): Promise<DashboardLoadResult> => {
  const data = createInitialDashboardData()
  const errors: DashboardLoadResult['errors'] = {}
  const selected = authorizeDashboardDisplay(display, permissions)
  const tasks: Promise<void>[] = []
  const queue = <Key extends DashboardWidgetId>(
    key: Key,
    loader: (value: DashboardParameters) => Promise<DashboardData[Key]>,
  ) => {
    if (!isDashboardWidgetEnabled(selected, key)) return
    tasks.push((async () => {
      try {
        data[key] = await loader(parameters)
      } catch (error) {
        errors[key] = extractApiErrorMessage(error, 'Unable to load this dashboard section.')
      }
    })())
  }
  queue('topKpis', getDashboardTopKpisEndpoint)
  queue('personnelDeploymentSummary', getDashboardPersonnelDeploymentSummaryEndpoint)
  queue('equipmentStatusOverview', getDashboardEquipmentStatusOverviewEndpoint)
  queue('criticalPersonnel', getDashboardCriticalPersonnelEndpoint)
  queue('criticalEquipment', getDashboardCriticalEquipmentEndpoint)
  queue('nearRotation', getDashboardNearRotationEndpoint)
  queue('locationLoadAnalysis', getDashboardLocationLoadAnalysisEndpoint)
  queue('personnelDeploymentHistory', getDashboardPersonnelDeploymentHistoryEndpoint)
  queue('operationalTimeMonitoring', getDashboardOperationalTimeMonitoringEndpoint)
  await Promise.all(tasks)
  return { data, errors }
}
