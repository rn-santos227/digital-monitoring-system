import { useAuth } from '~/composables/useAuth'
import { ROUTE_PATHS } from '~/constants/routes.constants'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  const { hasCheckedSession, isAuthenticated, initializeSession } = useAuth()

  if (!hasCheckedSession.value) {
    await initializeSession()
  }

  if (to.path === ROUTE_PATHS.root) {
    return
  }

  if (!isAuthenticated.value && to.path !== ROUTE_PATHS.login) {
    return navigateTo(ROUTE_PATHS.login, { replace: true })
  }

  if (isAuthenticated.value && to.path === ROUTE_PATHS.login) {
    return navigateTo(ROUTE_PATHS.home, { replace: true })
  }
})
