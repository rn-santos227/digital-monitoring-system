import type { DashboardValueDefinition, DashboardDisplayGroup } from '~/constants/ui.constants'
import type {
  DashboardDisplaySettings,
  DashboardKpiId,
  DashboardPersonnelValueId,
  DashboardEquipmentValueId,
  DashboardOperationalValueId,
  DashboardWidgetId,
} from '~/types/domain/dashboard'
import { PRIVILEGE_CODES } from '~/constants/privileges.constants'

export const DASHBOARD_DISPLAY_STORAGE_KEY = 'afp-dashboard-display'
export const DASHBOARD_DISPLAY_KPIS_LABEL = 'KPI cards'
export const DASHBOARD_DISPLAY_PERSONNEL_LABEL = 'Personnel summary values'
export const DASHBOARD_DISPLAY_EQUIPMENT_LABEL = 'Equipment status values'
export const DASHBOARD_DISPLAY_OPERATIONAL_LABEL = 'Operational time values'
export const DASHBOARD_DISPLAY_WIDGETS_LABEL = 'Dashboard sections'
export const DASHBOARD_DISPLAY_EMPTY_MESSAGE = 'No dashboard values are selected or available with your privileges. Open Advanced Search & Dashboard Display to choose what to show.'
export const DASHBOARD_DISPLAY_LOAD_ERROR = 'Some dashboard values could not be loaded.'
export const DASHBOARD_DISPLAY_STORAGE_WARNING = 'Browser storage is unavailable. These choices will apply for this visit but may not be saved.'
export const DASHBOARD_DISPLAY_KPIS_TITLE = 'Personnel KPIs'
export const DASHBOARD_PERSONNEL_SUMMARY_TITLE = 'Personnel Deployment Summary'
export const DASHBOARD_EQUIPMENT_SUMMARY_TITLE = 'Equipment Status Overview'
export const DASHBOARD_OPERATIONAL_SUMMARY_TITLE = 'Operational Time Monitoring'

export const DASHBOARD_KPI_OPTIONS: readonly DashboardValueDefinition<DashboardKpiId>[] = Object.freeze([
  { key: 'totalRegistered', label: 'Total Registered', classes: 'border-blue-700 bg-blue-600' },
  { key: 'deployed', label: 'Deployed', classes: 'border-emerald-700 bg-emerald-600' },
  { key: 'standbyAlert', label: 'Standby-Alert', classes: 'border-amber-700 bg-amber-500' },
  { key: 'noComms', label: 'No Comms', classes: 'border-pink-700 bg-pink-500' },
  { key: 'injuredOrDead', label: 'Injured / Dead', classes: 'border-rose-800 bg-rose-700' },
])
export const DASHBOARD_PERSONNEL_VALUE_OPTIONS: readonly DashboardValueDefinition<DashboardPersonnelValueId>[] = Object.freeze([
  { key: 'deployed', label: 'Deployed', classes: 'text-emerald-600' },
  { key: 'unavailable', label: 'Unavailable', classes: 'text-slate-500' },
  { key: 'standbyAlert', label: 'Standby-Alert', classes: 'text-amber-600' },
  { key: 'injured', label: 'Injured', classes: 'text-rose-600' },
  { key: 'dead', label: 'Dead', classes: 'text-pink-900' },
])
export const DASHBOARD_EQUIPMENT_VALUE_OPTIONS: readonly DashboardValueDefinition<DashboardEquipmentValueId>[] = Object.freeze([
  { key: 'operational', label: 'Operational', classes: 'text-emerald-600' },
  { key: 'standbyReady', label: 'Standby-Ready', classes: 'text-blue-600' },
  { key: 'partiallyOperational', label: 'Partially Operational', classes: 'text-amber-600' },
  { key: 'underMaintenance', label: 'Under Maintenance', classes: 'text-pink-600' },
  { key: 'defective', label: 'Defective', classes: 'text-rose-600' },
])
export const DASHBOARD_OPERATIONAL_VALUE_OPTIONS: readonly DashboardValueDefinition<DashboardOperationalValueId>[] = Object.freeze([
  { key: 'activeDeploymentCount', label: 'Active Deployments', classes: '' },
  { key: 'averageActiveDays', label: 'Average Active Days', classes: '' },
  { key: 'longestActiveDays', label: 'Longest Active Days', classes: '' },
])
export const DASHBOARD_WIDGET_OPTIONS: readonly { key: DashboardWidgetId; label: string }[] = Object.freeze([
  { key: 'topKpis', label: DASHBOARD_DISPLAY_KPIS_TITLE },
  { key: 'personnelDeploymentSummary', label: DASHBOARD_PERSONNEL_SUMMARY_TITLE },
  { key: 'equipmentStatusOverview', label: DASHBOARD_EQUIPMENT_SUMMARY_TITLE },
  { key: 'criticalPersonnel', label: 'Critical Personnel' },
  { key: 'criticalEquipment', label: 'Critical Equipment' },
  { key: 'nearRotation', label: 'Near Rotation' },
  { key: 'locationLoadAnalysis', label: 'Location Load Analysis' },
  { key: 'personnelDeploymentHistory', label: 'Personnel Deployment History' },
  { key: 'operationalTimeMonitoring', label: DASHBOARD_OPERATIONAL_SUMMARY_TITLE },
])

export const DASHBOARD_DISPLAY_GROUPS: readonly DashboardDisplayGroup<keyof DashboardDisplaySettings, DashboardWidgetId>[] = Object.freeze([
  { key: 'kpis', label: DASHBOARD_DISPLAY_KPIS_LABEL, widget: 'topKpis', options: DASHBOARD_KPI_OPTIONS },
  { key: 'personnelValues', label: DASHBOARD_DISPLAY_PERSONNEL_LABEL, widget: 'personnelDeploymentSummary', options: DASHBOARD_PERSONNEL_VALUE_OPTIONS },
  { key: 'equipmentValues', label: DASHBOARD_DISPLAY_EQUIPMENT_LABEL, widget: 'equipmentStatusOverview', options: DASHBOARD_EQUIPMENT_VALUE_OPTIONS },
  { key: 'operationalValues', label: DASHBOARD_DISPLAY_OPERATIONAL_LABEL, widget: 'operationalTimeMonitoring', options: DASHBOARD_OPERATIONAL_VALUE_OPTIONS },
  { key: 'widgets', label: DASHBOARD_DISPLAY_WIDGETS_LABEL, widget: null, options: DASHBOARD_WIDGET_OPTIONS },
])

const personnelPermissions = Object.freeze([PRIVILEGE_CODES.personnelView, PRIVILEGE_CODES.deploymentView])
const equipmentPermissions = Object.freeze([PRIVILEGE_CODES.equipmentView])
const deploymentPermissions = Object.freeze([PRIVILEGE_CODES.deploymentView])
export const DASHBOARD_WIDGET_PERMISSIONS: Readonly<Record<DashboardWidgetId, readonly string[]>> = Object.freeze({
  topKpis: personnelPermissions,
  personnelDeploymentSummary: personnelPermissions,
  criticalPersonnel: personnelPermissions,
  locationLoadAnalysis: personnelPermissions,
  personnelDeploymentHistory: personnelPermissions,
  equipmentStatusOverview: equipmentPermissions,
  criticalEquipment: equipmentPermissions,
  nearRotation: deploymentPermissions,
  operationalTimeMonitoring: deploymentPermissions,
})

export const INITIAL_DASHBOARD_DISPLAY = Object.freeze({
  kpis: Object.freeze(DASHBOARD_KPI_OPTIONS.map((item) => item.key)),
  personnelValues: Object.freeze(DASHBOARD_PERSONNEL_VALUE_OPTIONS.map((item) => item.key)),
  equipmentValues: Object.freeze(DASHBOARD_EQUIPMENT_VALUE_OPTIONS.map((item) => item.key)),
  operationalValues: Object.freeze(DASHBOARD_OPERATIONAL_VALUE_OPTIONS.map((item) => item.key)),
  widgets: Object.freeze(DASHBOARD_WIDGET_OPTIONS.map((item) => item.key)),
})
