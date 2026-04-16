import {
  DEFAULT_AUTHENTICATED_REDIRECT_PATH,
  DEFAULT_UNAUTHORIZED_REDIRECT_PATH,
  PUBLIC_ROUTE_PATHS,
  ROUTE_PERMISSION_MATRIX,
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
  const hasRouteAccess = authStore.hasPermissionAccess(requiredPermissions)

  if (!hasRouteAccess) {
    return navigateTo(DEFAULT_UNAUTHORIZED_REDIRECT_PATH)
  }
})
