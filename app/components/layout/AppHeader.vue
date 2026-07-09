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
      <NotificationMenu />

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

      <ProfileSettingsModal
        v-if="isProfileSettingsOpen"
        :active-tab="profileSettingsActiveTab"
        :user="currentUser"
        :is-submitting="isProfileSettingsSubmitting"
        :warning-message="profileSettingsWarning"
        :error-message="profileSettingsError"
        @close="closeProfileSettings"
        @update:active-tab="setProfileSettingsActiveTab"
        @save-details="onSaveDetails"
        @save-email="onSaveEmail"
        @save-other-details="onSaveOtherDetails"
        @save-password="onSavePassword"
      />
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
import { useProfileSettings } from '~/composables/useProfileSettings'
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
const {
  activeTab: profileSettingsActiveTab,
  error: profileSettingsError,
  isOpen: isProfileSettingsOpen,
  isSubmitting: isProfileSettingsSubmitting,
  warning: profileSettingsWarning,
  closeSettings: closeProfileSettings,
  openSettings: openProfileSettings,
  setActiveTab: setProfileSettingsActiveTab,
  onSaveDetails,
  onSaveEmail,
  onSaveOtherDetails,
  onSavePassword,
} = useProfileSettings()

const onMenuSelect = async (item: BaseMenuItem) => {
  if (item.value === 'profile' || item.value === 'my-account') {
    openProfileSettings('details')
    return
  }

  if (item.value === 'settings') {
    openProfileSettings('other')
    return
  }

  if (item.value === 'logout') {
    await handleLogout()
  }
}
</script>
