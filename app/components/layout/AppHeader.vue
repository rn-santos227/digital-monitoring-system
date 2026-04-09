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
