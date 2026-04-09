<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <template v-if="isLoginRoute">
      <slot />
    </template>

    <template v-else>
      <div class="flex min-h-screen">
        <LayoutAppSidebar />
        <div class="flex min-h-screen min-w-0 flex-1 flex-col">
          <LayoutAppHeader />
          <main class="flex-1 p-6">
            <slot />
          </main>
          <LayoutAppFooter />
        </div>
      </div>
    </template>

    <StackModal />
    <StackToast />
    <StackDialog />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import StackToast from '../components/ui/StackToast.vue'
import StackDialog from '../components/ui/StackDialog.vue'
import StackModal from '../components/ui/StackModal.vue'
import { ROUTE_PATHS } from '~/constants/routes.constants'

const route = useRoute()
const isLoginRoute = computed(() => route.path === ROUTE_PATHS.login)
</script>
