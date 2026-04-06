<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold">AFP Monitoring System</h1>
    <p class="mt-2">Baseline page is working.</p>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { ROUTE_PATHS } from '~/constants/routes.constants'

const router = useRouter()
const { currentUser, isLoggingOut, logout } = useAuth()

const onLogout = async () => {
  await logout()
  await router.push(ROUTE_PATHS.login)
}
</script>
