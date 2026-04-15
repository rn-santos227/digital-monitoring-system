import {
  DEFAULT_AUTHENTICATED_REDIRECT_PATH,
  DEFAULT_UNAUTHORIZED_REDIRECT_PATH,
  PUBLIC_ROUTE_PATHS,
  ROUTE_PERMISSION_MATRIX,
} from '~/constants/auth.constants'
import { ROUTE_PATHS } from '~/constants/routes.constants'
import { useAuthStore } from '~/stores/auth'
import { getStoredSessionToken } from '~/utils/auth-session'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const isPublicRoute = PUBLIC_ROUTE_PATHS.includes(to.path as "/" | "/login")

  if (isPublicRoute && authStore.isAuthenticated && to.path !== ROUTE_PATHS.root) {
    return navigateTo(DEFAULT_AUTHENTICATED_REDIRECT_PATH)
  }

  if (isPublicRoute) {
    return
  }

  if (!authStore.hasCheckedSession) {
    const hasValidToken = Boolean(getStoredSessionToken())

    if (!hasValidToken) {
      return navigateTo(ROUTE_PATHS.login)
    }

    await authStore.fetchSession()
  }

  if (!authStore.isAuthenticated) {
    return navigateTo(ROUTE_PATHS.login)
  }

  const requiredPermissions = ROUTE_PERMISSION_MATRIX[to.path]

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return
  }

  const hasRouteAccess = requiredPermissions.every((permissionCode) => {
    return authStore.hasPermission(permissionCode)
  })

  if (!hasRouteAccess) {
    return navigateTo(DEFAULT_UNAUTHORIZED_REDIRECT_PATH)
  }
})
