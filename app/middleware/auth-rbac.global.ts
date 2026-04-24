import {
  DEFAULT_AUTHENTICATED_REDIRECT_PATH,
  DEFAULT_UNAUTHORIZED_REDIRECT_PATH,
  PUBLIC_ROUTE_PATHS,
  ROUTE_PERMISSION_ANY_MATRIX,
  ROUTE_PERMISSION_MATRIX,
  ROUTE_PERMISSION_PREFIX_MATRIX,
} from '~/constants/auth.constants'
import { ROUTE_PATHS } from '~/constants/routes.constants'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  if (!authStore.hasCheckedSession) {
    await authStore.fetchSession()
  }

  const isPublicRoute = PUBLIC_ROUTE_PATHS.includes(to.path as '/' | '/login')

  if (authStore.isAuthenticated) {
    if (isPublicRoute) {
      return navigateTo(DEFAULT_AUTHENTICATED_REDIRECT_PATH)
    }
  } else {
    if (to.path === ROUTE_PATHS.root) {
      return navigateTo(ROUTE_PATHS.login)
    }

    if (!isPublicRoute) {
      return navigateTo(ROUTE_PATHS.login)
    }

    return
  }

  const requiredPermissions = ROUTE_PERMISSION_MATRIX[to.path]
    ?? Object.entries(ROUTE_PERMISSION_PREFIX_MATRIX).find(([routePrefix]) => to.path.startsWith(routePrefix))?.[1]

  const usesAnyPermission = ROUTE_PERMISSION_ANY_MATRIX[to.path] ?? false
  const hasRouteAccess = usesAnyPermission
    ? authStore.hasAnyPermissionAccess(requiredPermissions)
    : authStore.hasPermissionAccess(requiredPermissions)

  if (!hasRouteAccess) {
    return navigateTo(DEFAULT_UNAUTHORIZED_REDIRECT_PATH)
  }
})
