<template>
  <header :class="APP_HEADER_CLASSES">
    <div class="flex items-center gap-3">
      <BaseIcon name="bell" class="text-slate-500" />
      <p class="text-sm text-slate-600">Digital AFP Personnel and Equipment Monitoring System</p>
    </div>

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
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { HEADER_ACCOUNT_MENU_ITEMS } from '~/constants/navigation.constants'
import { APP_HEADER_CLASSES } from '~/constants/ui.constants'
import type { BaseMenuItem } from '~/types/domain/misc'
import { useAuthStore } from '~/stores/auth'

const emit = defineEmits<{
  (event: 'logout'): void
}>()

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)

const accountLabel = computed(() => currentUser.value?.fullName || currentUser.value?.email || 'Authenticated User')

const userInitials = computed(() => {
  const name = currentUser.value?.fullName || currentUser.value?.email || 'AU'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
})

const onMenuSelect = (item: BaseMenuItem) => {
  if (item.value === 'logout') {
    emit('logout')
  }
}
</script>
