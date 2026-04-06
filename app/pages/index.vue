<template>
  <main class="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
    <BaseCard title="AFP Monitoring System" class="w-full" padding="lg">
      <p class="text-slate-700">
        You are signed in as
        <span class="font-semibold">{{ currentUser?.fullName ?? currentUser?.username }}</span>.
      </p>
      <p class="mt-2 text-sm text-slate-500">The dashboard can now be loaded for authenticated users.</p>

      <template #actions>
        <BaseButton variant="danger" :disabled="isLoggingOut" @click="onLogout">
          {{ isLoggingOut ? 'Signing out...' : 'Sign Out' }}
        </BaseButton>
      </template>
    </BaseCard>
  </main>
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
