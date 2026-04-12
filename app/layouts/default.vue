<template>
  <div>
    <div v-if="showApplicationShell" class="flex min-h-screen bg-slate-100">
      <AppSidebar />

      <div class="flex min-h-screen flex-1 flex-col">
        <AppHeader @logout="handleLogout" />
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
import { useDialog } from '~/composables/useDialog'
import {
  DASHBOARD_LOGOUT_DIALOG_CANCEL_LABEL,
  DASHBOARD_LOGOUT_DIALOG_CONFIRM_LABEL,
  DASHBOARD_LOGOUT_DIALOG_MESSAGE,
  DASHBOARD_LOGOUT_DIALOG_TITLE,
} from '~/constants/page.constants'
import { ROUTE_PATHS } from '~/constants/routes.constants'
import { useAuthStore } from '~/stores/auth'
import { getStoredSessionToken } from '~/utils/auth-session'

const route = useRoute()
const authStore = useAuthStore()
const { showDialog } = useDialog()

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

const handleLogout = async () => {
  const result = await showDialog({
    type: 'question',
    title: DASHBOARD_LOGOUT_DIALOG_TITLE,
    message: DASHBOARD_LOGOUT_DIALOG_MESSAGE,
    confirmLabel: DASHBOARD_LOGOUT_DIALOG_CONFIRM_LABEL,
    cancelLabel: DASHBOARD_LOGOUT_DIALOG_CANCEL_LABEL,
  })

  if (!result.confirmed) {
    return
  }

  await authStore.logout()
  await navigateTo(ROUTE_PATHS.login)
}
</script>
