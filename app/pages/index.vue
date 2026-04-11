<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-600">
    <p class="text-sm font-medium">Checking secure session...</p>
  </main>
</template>

<script setup lang="ts">
import { ROUTE_PATHS } from '~/constants/routes.constants'
import { useAuthStore } from '~/stores/auth'
import { getStoredSessionToken } from '~/utils/auth-session'

const authStore = useAuthStore()

if (import.meta.client) {
  const hasValidToken = Boolean(getStoredSessionToken())

  if (!hasValidToken) {
    await navigateTo(ROUTE_PATHS.login, { replace: true })
  } else {
    await authStore.fetchSession()

    if (authStore.isAuthenticated) {
      await navigateTo(ROUTE_PATHS.home, { replace: true })
    } else {
      await navigateTo(ROUTE_PATHS.login, { replace: true })
    }
  }
}
</script>
