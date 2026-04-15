import { ROUTE_PATHS } from '~/constants/routes.constants'

export const PUBLIC_ROUTE_PATHS = Object.freeze([ROUTE_PATHS.root, ROUTE_PATHS.login])

export const ROUTE_PERMISSION_MATRIX: Readonly<Record<string, readonly string[]>> = Object.freeze({
  [ROUTE_PATHS.auditTrail]: ['audit.view'],
})

export const DEFAULT_AUTHENTICATED_REDIRECT_PATH = ROUTE_PATHS.home
export const DEFAULT_UNAUTHORIZED_REDIRECT_PATH = ROUTE_PATHS.home
