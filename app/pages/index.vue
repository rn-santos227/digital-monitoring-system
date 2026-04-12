<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-600">
    <p class="text-sm font-medium">Checking secure session...</p>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ROUTE_PATHS } from '~/constants/routes.constants'
import { useAuthStore } from '~/stores/auth'
import { getStoredSessionToken } from '~/utils/auth-session'

const authStore = useAuthStore()

onMounted(async () => {
  const hasStoredToken = Boolean(getStoredSessionToken())

  if (!hasStoredToken) {
    await navigateTo(ROUTE_PATHS.login, { replace: true })
    return
  }

  try {
    await authStore.fetchSession()
  } finally {
    const destination = authStore.isAuthenticated ? ROUTE_PATHS.home : ROUTE_PATHS.login
    await navigateTo(destination, { replace: true })
  }
})
</script>
