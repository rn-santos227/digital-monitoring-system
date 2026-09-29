import { DASHBOARD_PARAMETER_LIMITS, DEFAULT_DASHBOARD_PARAMETERS } from '../../constants'
import type { DashboardParameters } from '../../requests'

const parseLimit = (value: unknown, fallback: number, maximum: number): number => {
  const normalizedValue = Array.isArray(value) ? value[0] : value
  const parsedValue = typeof normalizedValue === 'number'
    ? normalizedValue
    : Number.parseInt(String(normalizedValue ?? ''), 10)

  if (!Number.isFinite(parsedValue)) {
    return fallback
  }

  return Math.min(maximum, Math.max(DASHBOARD_PARAMETER_LIMITS.minimum, Math.trunc(parsedValue)))
}

export const parseDashboardParameters = (query: Record<string, unknown>): DashboardParameters => ({
  personnelLimit: parseLimit(
    query.personnelLimit,
    DEFAULT_DASHBOARD_PARAMETERS.personnelLimit,
    DASHBOARD_PARAMETER_LIMITS.maximumRecordLimit,
  ),
  equipmentLimit: parseLimit(
    query.equipmentLimit,
    DEFAULT_DASHBOARD_PARAMETERS.equipmentLimit,
    DASHBOARD_PARAMETER_LIMITS.maximumRecordLimit,
  ),
  deploymentLimit: parseLimit(
    query.deploymentLimit,
    DEFAULT_DASHBOARD_PARAMETERS.deploymentLimit,
    DASHBOARD_PARAMETER_LIMITS.maximumRecordLimit,
  ),
  itemLimit: parseLimit(
    query.itemLimit,
    DEFAULT_DASHBOARD_PARAMETERS.itemLimit,
    DASHBOARD_PARAMETER_LIMITS.maximumItemLimit,
  ),
})
