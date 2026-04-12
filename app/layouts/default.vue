<template>
  <div>
    <div v-if="showApplicationShell" class="flex min-h-screen bg-slate-100">
      <AppSidebar />

      <div class="flex min-h-screen flex-1 flex-col">
        <AppHeader />
        <div class="flex-1">
          <slot />
        </div>
        <AppFooter />
      </div>
    </div>

    <slot v-else />

    <StackToast />
    <StackDialog />
    <StackModal />
    <BaseLoader />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { ROUTE_PATHS } from '~/constants/routes.constants'
import { useAuthStore } from '~/stores/auth'
import { getStoredSessionToken } from '~/utils/auth-session'

const route = useRoute()
const authStore = useAuthStore()

const isPublicRoute = computed(() => {
  return route.path === ROUTE_PATHS.login || route.path === ROUTE_PATHS.root
})

const showApplicationShell = computed(() => !isPublicRoute.value)

const ensureAuthenticatedRoute = async () => {
  if (isPublicRoute.value || !import.meta.client) return

  if (!authStore.hasCheckedSession) {
    const hasValidToken = Boolean(getStoredSessionToken())

    if (!hasValidToken) {
      await navigateTo(ROUTE_PATHS.login)
      return
    }

    await authStore.fetchSession()
  }

  if (!authStore.isAuthenticated) {
    await navigateTo(ROUTE_PATHS.login)
  }
}

watch(
  () => route.path,
  () => {
    void ensureAuthenticatedRoute()
  },
  { immediate: true }
)
</script>
