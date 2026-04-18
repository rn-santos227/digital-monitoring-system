<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="USERS_PAGE_SECTION_CLASSES">
      <header :class="USERS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ USERS_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ USERS_PAGE_SUBTITLE }}</p>
      </header>

      <BaseTab
        :model-value="activeTab"
        :items="visibleTabItems"
        :aria-label="USERS_PAGE_TABS_ARIA_LABEL"
        @update:model-value="onTabChange"
      />

      <BaseAlert
        v-if="error"
        :message="error"
        tone="danger"
      />
      
      <template v-if="activeTab === 'user-profile'">
        <div v-if="canCreateUserProfile" :class="USERS_TABLE_ACTIONS_ROW_CLASSES">
          <BaseButton @click="onOpenUserProfileModal">
            {{ USERS_PROFILE_CREATE_BUTTON_LABEL }}
          </BaseButton>
        </div>

        <DataTable
          :title="USERS_PROFILE_TABLE_TITLE"
          :columns="USERS_PROFILE_TABLE_COLUMNS"
          :rows="profileTableRows"
          row-key="id"
          :actions="profileTableActions"
          :action-button-count="profileTableActions.length"
          :actions-column-label="USERS_PROFILE_TABLE_ACTIONS_COLUMN_LABEL"
          :is-loading="isLoading"
          :search-query="profileSearchQuery"
          :search-placeholder="USERS_PROFILE_TABLE_SEARCH_PLACEHOLDER"
          :empty-message="USERS_PROFILE_TABLE_EMPTY_MESSAGE"
          :current-page="profilePagination.page"
          :total-pages="profilePagination.totalPages"
          @action="onProfileAction"
          @update:search-query="onProfileSearch"
          @update:current-page="onProfilePageChange"
        />
      </template>

      <template v-else>
        <div v-if="canCreateAccountType" :class="USERS_TABLE_ACTIONS_ROW_CLASSES">
          <BaseButton @click="isAccountTypeModalOpen = true">
            {{ USERS_ACCOUNT_CREATE_BUTTON_LABEL }}
          </BaseButton>
        </div>

        <DataTable
          :title="USERS_ACCOUNT_TABLE_TITLE"
          :columns="USERS_ACCOUNT_TABLE_COLUMNS"
          :rows="accountTableRows"
          row-key="id"
          :actions="accountTableActions"
          :action-button-count="accountTableActions.length"
          :actions-column-label="USERS_ACCOUNT_TABLE_ACTIONS_COLUMN_LABEL"
          :is-loading="isLoading"
          :search-query="accountSearchQuery"
          :search-placeholder="USERS_ACCOUNT_TABLE_SEARCH_PLACEHOLDER"
          :empty-message="USERS_ACCOUNT_TABLE_EMPTY_MESSAGE"
          :current-page="accountPagination.page"
          :total-pages="accountPagination.totalPages"
          @action="onAccountAction"
          @update:search-query="onAccountSearch"
          @update:current-page="onAccountPageChange"
        />
      </template>

      <UserProfileModal
        v-if="isUserProfileModalOpen"
        :account-type-options="accountTypeOptions"
        @close="isUserProfileModalOpen = false"
        @submit="onCreateUserProfile"
      />

      <AccountTypeModal
        v-if="isAccountTypeModalOpen"
        :privilege-options="privilegeOptions"
        @close="isAccountTypeModalOpen = false"
        @submit="onCreateAccountType"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDialog } from '~/composables/useDialog'
import {
  USERS_ACCOUNT_TABLE_ACTIONS,
  USERS_ACCOUNT_TABLE_ACTIONS_COLUMN_LABEL,
  USERS_ACCOUNT_TABLE_COLUMNS,
  USERS_ACCOUNT_CREATE_BUTTON_LABEL,
  USERS_ACCOUNT_TABLE_EMPTY_MESSAGE,
  USERS_ACCOUNT_TABLE_SEARCH_PLACEHOLDER,
  USERS_ACCOUNT_TABLE_TITLE,
  USERS_ACCOUNT_REQUIRED_PERMISSIONS,
  USERS_PAGE_SECTION_CLASSES,
  USERS_PAGE_SUBTITLE,
  USERS_PAGE_TAB_ITEMS,
  USERS_PAGE_TAB_REQUIRED_PERMISSIONS,
  USERS_PAGE_TABS_ARIA_LABEL,
  USERS_PAGE_TITLE,
  USERS_PROFILE_TABLE_ACTIONS,
  USERS_PROFILE_TABLE_ACTIONS_COLUMN_LABEL,
  USERS_PROFILE_TABLE_COLUMNS,
  USERS_PROFILE_CREATE_BUTTON_LABEL,
  USERS_PROFILE_TABLE_EMPTY_MESSAGE,
  USERS_PROFILE_TABLE_SEARCH_PLACEHOLDER,
  USERS_PROFILE_TABLE_TITLE,
  USERS_PROFILE_REQUIRED_PERMISSIONS,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES } from '~/constants/shared.constants'
import { USERS_PAGE_HEADER_CLASSES, USERS_TABLE_ACTIONS_ROW_CLASSES } from '~/constants/shared.constants'
import { useUsers } from '~/composables/useUsers'
import {
  buildActivationDialog,
  DELETE_PROFILE_DIALOG,
  resolveProfileActionRowId,
  resolveProfileActionRowIsActive,
  USER_PROFILE_ACTION_KEYS,
  useUsersPageHandlers,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type { UpdateUserPasswordPayload, UpdateUserProfilePayload } from '~/types/domain/users'

const {
  activeTab,
  profileSearchQuery,
  accountSearchQuery,
  profileTableRows,
  accountTableRows,
  profilePagination,
  accountPagination,
  isLoading,
  error,
  loadUserProfiles,
  loadUserAccounts,
  loadPrivileges,
  privilegeOptions,
  accountTypeOptions,
  createUserProfile,
  createAccountType,
  getUserProfileById,
  updateUserProfile,
  updateUserPassword,
  updateUserActivation,
  deleteUserProfile,
} = useUsers()
const authStore = useAuthStore()
const { showDialog } = useDialog()

const visibleTabItems = computed(() => {
  return USERS_PAGE_TAB_ITEMS.filter((tabItem) => {
    const requiredPermissions = USERS_PAGE_TAB_REQUIRED_PERMISSIONS[tabItem.id as keyof typeof USERS_PAGE_TAB_REQUIRED_PERMISSIONS]
    return authStore.hasPermissionAccess(requiredPermissions)
  })
})

const { handleTabChange, handleProfileSearch, handleAccountSearch } = useUsersPageHandlers(
  activeTab,
  profileSearchQuery,
  accountSearchQuery
)

const onTabChange = (nextTab: string) => {
  handleTabChange(nextTab)
}

const onProfileSearch = (value: string) => {
  handleProfileSearch(value)
  void loadUserProfiles(1, value)
}

const onAccountSearch = (value: string) => {
  handleAccountSearch(value)
  void loadUserAccounts(1, value)
}

const onProfilePageChange = (nextPage: number) => {
  void loadUserProfiles(nextPage)
}

const onAccountPageChange = (nextPage: number) => {
  void loadUserAccounts(nextPage)
}
const isCreateUserProfileModalOpen = ref(false)
const isUpdateUserProfileModalOpen = ref(false)
const isUserPasswordModalOpen = ref(false)
const isAccountTypeModalOpen = ref(false)
const selectedUserProfileId = ref('')
const selectedUserProfile = ref<{ email: string; fullName: string; avatarUrl: string | null; accountTypeIds: string[] } | null>(null)
const profileWarning = ref('')

const canCreateUserProfile = computed(() => authStore.hasPermissionAccess(USERS_PROFILE_REQUIRED_PERMISSIONS.create))
const canCreateAccountType = computed(() => authStore.hasPermissionAccess(USERS_ACCOUNT_REQUIRED_PERMISSIONS.create))

const profileTableActions = computed(() => {
  return USERS_PROFILE_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'edit-user-profile' || action.key === 'change-user-password' || action.key === 'toggle-user-activation') {
      return authStore.hasPermissionAccess(USERS_PROFILE_REQUIRED_PERMISSIONS.edit)
    }

    if (action.key === 'delete-user-profile') {
      return authStore.hasPermissionAccess(USERS_PROFILE_REQUIRED_PERMISSIONS.delete)
    }

    return true
  })
})

const accountTableActions = computed(() => {
  return USERS_ACCOUNT_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'edit-account-type') {
      return authStore.hasPermissionAccess(USERS_ACCOUNT_REQUIRED_PERMISSIONS.edit)
    }

    if (action.key === 'delete-account-type') {
      return authStore.hasPermissionAccess(USERS_ACCOUNT_REQUIRED_PERMISSIONS.delete)
    }

    return true
  })
})

const onOpenCreateUserProfileModal = async () => {
  profileWarning.value = ''
  if (accountTypeOptions.value.length === 0) {
    await loadUserAccounts(1)
  }

  isCreateUserProfileModalOpen.value = true
}

const onCreateUserProfile = async (payload: Parameters<typeof createUserProfile>[0]) => {
  await createUserProfile(payload)
  isCreateUserProfileModalOpen.value = false
  await loadUserProfiles(1)
}

const onCreateAccountType = async (payload: Parameters<typeof createAccountType>[0]) => {
  await createAccountType(payload)
  isAccountTypeModalOpen.value = false
  await loadUserAccounts(1)
}

watch(isAccountTypeModalOpen, (isOpen) => {
  if (isOpen) {
    void loadPrivileges()
  }
})

watch(
  visibleTabItems,
  (items) => {
    if (items.some(item => item.id === activeTab.value)) {
      return
    }

    const firstVisibleTab = items.at(0)
    if (firstVisibleTab) {
      activeTab.value = firstVisibleTab.id as typeof activeTab.value
    }
  },
  { immediate: true }
)

const onProfileAction = (_payload: { actionKey: string; row: Record<string, unknown> }) => {
  // Modal create functionality added in this update; edit/delete handlers will be implemented next.
}

const onAccountAction = (_payload: { actionKey: string; row: Record<string, unknown> }) => {
  // Modal create functionality added in this update; edit/delete handlers will be implemented next.
}
</script>
