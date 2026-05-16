<template>
  <header :class="headerClasses">
    <div class="flex flex-1 items-center gap-4 pr-4">
      <GeneralSearchField
        v-model="searchQuery"
        :placeholder="DASHBOARD_SEARCH_PLACEHOLDER"
        @search="onSearch"
      />
    </div>
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="rounded-full p-2 text-slate-500 transition hover:bg-emerald-200/70 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        aria-label="Notifications"
      >
        <BaseIcon name="bell" class="h-5 w-5" />
      </button>

      <BaseMenu
        :items="HEADER_ACCOUNT_MENU_ITEMS as BaseMenuItem[]"
        align="right"
        @select="onMenuSelect"
      >
        <template #trigger>
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-semibold text-white">
              {{ userInitials }}
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-slate-800">{{ accountLabel }}</p>
              <p class="text-xs text-slate-500">Authenticated session</p>
            </div>
          </div>
        </template>
      </BaseMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { DASHBOARD_SEARCH_PLACEHOLDER, HEADER_ACCOUNT_MENU_ITEMS } from '~/constants/navigation.constants'
import { APP_HEADER_CLASSES, APP_SURFACE_THEME_CLASSES } from '~/constants/ui.constants'
import type { BaseMenuItem } from '~/types/domain/misc'
import { useLogoutHandler } from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import { useApplicationSettingsStore } from '~/stores/application-settings'

const authStore = useAuthStore()
const applicationSettingsStore = useApplicationSettingsStore()
const { currentUser } = storeToRefs(authStore)
const { item: applicationSettingsItem } = storeToRefs(applicationSettingsStore)

const searchQuery = ref('')
const accountLabel = computed(() => currentUser.value?.fullName || currentUser.value?.email || 'Authenticated User')
const resolvedTheme = computed(() => (applicationSettingsItem.value?.appTheme ?? 'light') as keyof typeof APP_SURFACE_THEME_CLASSES)
const headerClasses = computed(() => [APP_HEADER_CLASSES, 'border-b', APP_SURFACE_THEME_CLASSES[resolvedTheme.value] ?? APP_SURFACE_THEME_CLASSES.light])

const userInitials = computed(() => {
  const name = currentUser.value?.fullName || currentUser.value?.email || 'AU'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
})

const onSearch = (value: string) => {
  searchQuery.value = value
}

const { handleLogout } = useLogoutHandler()

const onMenuSelect = async (item: BaseMenuItem) => {
  if (item.value === 'logout') {
    await handleLogout()
  }
}
</script>
