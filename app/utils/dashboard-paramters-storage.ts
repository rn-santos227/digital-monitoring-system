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
