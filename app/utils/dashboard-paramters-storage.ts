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

}
