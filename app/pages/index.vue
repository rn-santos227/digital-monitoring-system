<template>
  <section class="flex min-h-[60vh] items-center justify-center px-4">
    <p class="text-sm text-slate-600">Validating your session...</p>
  </section>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { ROUTE_PATHS } from '~/constants/routes.constants'

const { hasCheckedSession, isAuthenticated, initializeSession } = useAuth()

if (!hasCheckedSession.value) {
  await initializeSession()
}

if (isAuthenticated.value) {
  await navigateTo(ROUTE_PATHS.home, { replace: true })
} else {
  await navigateTo(ROUTE_PATHS.login, { replace: true })
}
</script>
