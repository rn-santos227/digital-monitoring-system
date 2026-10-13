<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="DASHBOARD_PAGE_SECTION_CLASSES">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold text-slate-900">{{ DASHBOARD_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ DASHBOARD_PAGE_SUBTITLE }}</p>
        <ClockDateWidget />
      </header>
      <DashboardAdvancedParameters
        :model-value="parameters"
        :display="display"
        :is-loading="isLoading"
        :warning-message="storageWarning"
        :error-message="hasErrors ? DASHBOARD_DISPLAY_LOAD_ERROR : ''"
        @apply="applyConfiguration"
      />
      <BaseInlineLoader v-if="isLoading" />
      <DashboardWidgetsGrid v-else :data="dashboardData" :display="effectiveDisplay" :errors="errors" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import DashboardAdvancedParameters from '~/components/dashboard/DashboardAdvancedParameters.vue'
import DashboardWidgetsGrid from '~/components/dashboard/DashboardWidgetsGrid.vue'
import ClockDateWidget from '~/components/general/ClockDateWidget.vue'
import {
  DASHBOARD_PAGE_SECTION_CLASSES,
  DASHBOARD_PAGE_SUBTITLE,
  DASHBOARD_PAGE_TITLE,
  DASHBOARD_DISPLAY_LOAD_ERROR,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES } from '~/constants/shared.constants'
import { createDashboardConfigurationHandlers } from '~/handlers/dashboard'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const {
  parameters,
  display,
  effectiveDisplay,
  dashboardData,
  errors,
  isLoading,
  storageWarning,
  applyConfiguration,
  initializeConfiguration,
} = createDashboardConfigurationHandlers(
  () => authStore.currentUser?.id ?? '',
  () => authStore.permissionCodes,
)
const hasErrors = computed(() => Object.keys(errors.value).length > 0)

onMounted(initializeConfiguration)
watch(
  () => [authStore.currentUser?.id, authStore.permissionCodes.join(',')],
  initializeConfiguration,
)
</script>
