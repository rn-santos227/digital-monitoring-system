<template>
  <header :class="APP_HEADER_CLASSES">
    <div class="w-full max-w-xl">
      <UiBaseTextField
        v-model="query"
        :label="''"
        :placeholder="DASHBOARD_SEARCH_PLACEHOLDER"
      />
    </div>

    <div class="ml-4 flex items-center gap-4">
      <div class="relative">
        <UiBaseButton
          variant="ghost"
          size="sm"
          icon-only
          icon-name="bell"
          aria-label="Notifications"
          class="rounded-full! p-2! shadow-none!"
        />
        <span class="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
          3
        </span>
      </div>

      <UiBaseMenu :items="menuItems" @select="onMenuSelect">
        <template #trigger>
          <span class="inline-flex items-center gap-2">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-semibold text-white">A</span>
            <span class="hidden text-sm font-medium text-slate-800 sm:inline">{{ displayName }}</span>
          </span>
        </template>
      </UiBaseMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DASHBOARD_SEARCH_PLACEHOLDER } from '~/constants/navigation.constants'
import { APP_HEADER_CLASSES } from '~/constants/ui.constants'
import { ROUTE_PATHS } from '~/constants/routes.constants'
import { useAuth } from '~/composables/useAuth'
import type { BaseMenuItem } from '~/types/domain/misc'

const query = ref('')
const router = useRouter()
const { currentUser, logout } = useAuth()

const menuItems: BaseMenuItem[] = [
  { label: 'My Account', value: 'account' },
  { label: 'Profile', value: 'profile' },
  { label: 'Settings', value: 'settings' },
  { label: 'Logout', value: 'logout', danger: true }
]

const displayName = computed(() => currentUser.value?.fullName || 'Admin User')

const onMenuSelect = async (item: BaseMenuItem) => {
  if (item.value === 'logout') {
    await logout()
    await router.push(ROUTE_PATHS.login)
  }
}
</script>
