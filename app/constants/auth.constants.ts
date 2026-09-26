import { ROUTE_PATHS } from '~/constants/routes.constants'
import {
  ACCOUNT_TYPE_PRIVILEGES,
  AUDIT_PRIVILEGES,
  BACKUP_PRIVILEGES,
  BATTALION_PRIVILEGES,
  COMPANY_PRIVILEGES,
  DEPLOYMENT_PRIVILEGES,
  ENGAGEMENT_PRIVILEGES,
  EQUIPMENT_PRIVILEGES,
  PERSONNEL_PRIVILEGES,
  TRAINING_PRIVILEGES,
  SETTINGS_PRIVILEGES,
  USER_PROFILE_PRIVILEGES,
} from '~/constants/privileges.constants'

export const PUBLIC_ROUTE_PATHS = Object.freeze([ROUTE_PATHS.root, ROUTE_PATHS.login])

export const ROUTE_PERMISSION_MATRIX: Readonly<Record<string, readonly string[]>> = Object.freeze({
  [ROUTE_PATHS.auditTrail]: AUDIT_PRIVILEGES.view,
  [ROUTE_PATHS.users]: Object.freeze([...USER_PROFILE_PRIVILEGES.view, ...ACCOUNT_TYPE_PRIVILEGES.view]),
  [ROUTE_PATHS.personnel]: PERSONNEL_PRIVILEGES.view,
  [ROUTE_PATHS.serviceStatuses]: PERSONNEL_PRIVILEGES.view,
  [ROUTE_PATHS.trainingRecords]: TRAINING_PRIVILEGES.manage,
  [ROUTE_PATHS.deploymentRecords]: DEPLOYMENT_PRIVILEGES.manage,
  [ROUTE_PATHS.engagementRecords]: ENGAGEMENT_PRIVILEGES.manage,
  [ROUTE_PATHS.equipmentCategories]: EQUIPMENT_PRIVILEGES.view,
  [ROUTE_PATHS.equipmentItems]: EQUIPMENT_PRIVILEGES.view,
  [ROUTE_PATHS.equipmentAssets]: EQUIPMENT_PRIVILEGES.view,
  [ROUTE_PATHS.equipmentIssuances]: EQUIPMENT_PRIVILEGES.view,
  [ROUTE_PATHS.incidents]: EQUIPMENT_PRIVILEGES.view,
  [ROUTE_PATHS.units]: Object.freeze([...BATTALION_PRIVILEGES.view, ...COMPANY_PRIVILEGES.view]),
  [ROUTE_PATHS.settings]: SETTINGS_PRIVILEGES.update,
})

export const ROUTE_PERMISSION_ANY_MATRIX: Readonly<Record<string, true>> = Object.freeze({
  [ROUTE_PATHS.users]: true,
  [ROUTE_PATHS.units]: true,
})

export const ROUTE_PERMISSION_PREFIX_MATRIX: Readonly<Record<string, readonly string[]>> = Object.freeze({
  [`${ROUTE_PATHS.personnel}/`]: PERSONNEL_PRIVILEGES.view,
  [`${ROUTE_PATHS.equipmentItems}/`]: EQUIPMENT_PRIVILEGES.view,
  [`${ROUTE_PATHS.incidents}/`]: EQUIPMENT_PRIVILEGES.view,
})

export const DEFAULT_AUTHENTICATED_REDIRECT_PATH = ROUTE_PATHS.home
export const DEFAULT_UNAUTHORIZED_REDIRECT_PATH = ROUTE_PATHS.home
