import { DASHBOARD_PARAMETER_LIMITS, DEFAULT_DASHBOARD_PARAMETERS } from '../../constants'
import type { DashboardParameters } from '../../requests'

const parseLimit = (value: unknown, fallback: number, maximum: number): number => {
  const normalizedValue = Array.isArray(value) ? value[0] : value
}
