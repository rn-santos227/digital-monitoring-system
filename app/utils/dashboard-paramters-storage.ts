import {
  DASHBOARD_PARAMETERS_STORAGE_KEY,
  DASHBOARD_PARAMETER_LIMITS,
  INITIAL_DASHBOARD_PARAMETERS,
} from '~/constants/page.constants'
import type { DashboardParameters } from '~/types/domain/dashboard'

type DashboardParameterInput = {
  [Key in keyof DashboardParameters]?: unknown
}

const normalizeLimit = (value: unknown, fallback: number, maximum: number): number => {
  const parsedValue = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)

  if (!Number.isFinite(parsedValue)) {
    return fallback
  }

  return Math.min(maximum, Math.max(DASHBOARD_PARAMETER_LIMITS.minimum, Math.trunc(parsedValue)))
}

export const normalizeDashboardParameters = (value?: DashboardParameterInput | null): DashboardParameters => ({
  personnelLimit: normalizeLimit(
    value?.personnelLimit,
    INITIAL_DASHBOARD_PARAMETERS.personnelLimit,
    DASHBOARD_PARAMETER_LIMITS.maximumRecordLimit,
  ),
  equipmentLimit: normalizeLimit(
    value?.equipmentLimit,
    INITIAL_DASHBOARD_PARAMETERS.equipmentLimit,
    DASHBOARD_PARAMETER_LIMITS.maximumRecordLimit,
  ),
  deploymentLimit: normalizeLimit(
    value?.deploymentLimit,
    INITIAL_DASHBOARD_PARAMETERS.deploymentLimit,
    DASHBOARD_PARAMETER_LIMITS.maximumRecordLimit,
  ),
  itemLimit: normalizeLimit(
    value?.itemLimit,
    INITIAL_DASHBOARD_PARAMETERS.itemLimit,
    DASHBOARD_PARAMETER_LIMITS.maximumItemLimit,
  ),
})

export const readDashboardParameters = (): DashboardParameters => {

}