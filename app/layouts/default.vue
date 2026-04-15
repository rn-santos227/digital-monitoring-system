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
import { computed } from 'vue'
import { ROUTE_PATHS } from '~/constants/routes.constants'

const route = useRoute()

const isPublicRoute = computed(() => {
  return route.path === ROUTE_PATHS.login || route.path === ROUTE_PATHS.root
})

const showApplicationShell = computed(() => !isPublicRoute.value)
</script>
