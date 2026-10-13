import {
  DASHBOARD_KPI_OPTIONS,
  DASHBOARD_PERSONNEL_VALUE_OPTIONS,
  DASHBOARD_EQUIPMENT_VALUE_OPTIONS,
  DASHBOARD_OPERATIONAL_VALUE_OPTIONS,
  DASHBOARD_WIDGET_OPTIONS,
  DASHBOARD_WIDGET_PERMISSIONS,
  INITIAL_DASHBOARD_DISPLAY,
} from '~/constants/page.constants'
import type {
  DashboardDisplaySettings,
  DashboardWidgetId,
} from '~/types/domain/dashboard'

const normalizeSelection = <Key extends string>(
  value: unknown,
  allowed: readonly Key[],
  fallback: readonly Key[],
): Key[] => {
  if (!Array.isArray(value)) {
    return [...fallback]
  }
  return allowed.filter((key) => value.includes(key))
}

export const normalizeDashboardDisplay = (
  value?: unknown,
): DashboardDisplaySettings => {
  const settings = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  return {
    kpis: normalizeSelection(
      settings.kpis,
      DASHBOARD_KPI_OPTIONS.map((item) => item.key),
      INITIAL_DASHBOARD_DISPLAY.kpis,
    ),
    personnelValues: normalizeSelection(
      settings.personnelValues,
      DASHBOARD_PERSONNEL_VALUE_OPTIONS.map((item) => item.key),
      INITIAL_DASHBOARD_DISPLAY.personnelValues,
    ),
    equipmentValues: normalizeSelection(
      settings.equipmentValues,
      DASHBOARD_EQUIPMENT_VALUE_OPTIONS.map((item) => item.key),
      INITIAL_DASHBOARD_DISPLAY.equipmentValues,
    ),
    operationalValues: normalizeSelection(
      settings.operationalValues,
      DASHBOARD_OPERATIONAL_VALUE_OPTIONS.map((item) => item.key),
      INITIAL_DASHBOARD_DISPLAY.operationalValues,
    ),
    widgets: normalizeSelection(
      settings.widgets,
      DASHBOARD_WIDGET_OPTIONS.map((item) => item.key),
      INITIAL_DASHBOARD_DISPLAY.widgets,
    ),
  }
}

export const isDashboardWidgetEnabled = (
  settings: DashboardDisplaySettings,
  key: DashboardWidgetId,
): boolean => {
  if (!settings.widgets.includes(key)) return false
  if (key === 'topKpis') return settings.kpis.length > 0
  if (key === 'personnelDeploymentSummary') return settings.personnelValues.length > 0
  if (key === 'equipmentStatusOverview') return settings.equipmentValues.length > 0
  if (key === 'operationalTimeMonitoring') return settings.operationalValues.length > 0
  return true
}

export const authorizeDashboardDisplay = (
  settings: DashboardDisplaySettings,
  permissions: readonly string[],
): DashboardDisplaySettings => {
  const normalized = normalizeDashboardDisplay(settings)
  return {
    ...normalized,
    widgets: normalized.widgets.filter((key) =>
      DASHBOARD_WIDGET_PERMISSIONS[key].every((permission) =>
        permissions.includes(permission),
      ),
    ),
  }
}

export const toggleDashboardSelection = <Key extends string>(
  selection: readonly Key[],
  key: Key,
  selected: boolean,
): Key[] => {
  return selected ? [...new Set([...selection, key])] : selection.filter((value) => value !== key)
}
