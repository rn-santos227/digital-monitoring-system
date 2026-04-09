<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <main class="flex flex-1">
      <slot />
    </main>
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
