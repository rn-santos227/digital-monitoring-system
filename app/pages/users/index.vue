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
      
      <template v-if="activeTab === 'user-profile'">
        <UsersFilter
          :model-value="profileFilters"
          :validation-errors="profileFilterValidationErrors"
          @apply="handleApplyProfileFilters"
          @reset="handleResetProfileFilters"
        />

        <div v-if="profileWarning" class="space-y-3">
          <BaseAlert :message="profileWarning" tone="warning" />
        </div>

        <BaseAlert
          v-if="error"
          :message="error"
          tone="danger"
        />

        <div v-if="canCreateUserProfile" :class="USERS_TABLE_ACTIONS_ROW_CLASSES">
         <BaseButton @click="onOpenCreateUserProfileModal">
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
          :show-search="false"
          :empty-message="USERS_PROFILE_TABLE_EMPTY_MESSAGE"
          :current-page="profilePagination.page"
          :total-pages="profilePagination.totalPages"
          @action="onProfileAction"
          @update:current-page="onProfilePageChange"
        />
      </template>

      <template v-else>
        <AccountTypesFilter
          :model-value="accountFilters"
          :validation-errors="accountFilterValidationErrors"
          @apply="handleApplyAccountFilters"
          @reset="handleResetAccountFilters"
        />

        <BaseAlert
          v-if="error"
          :message="error"
          tone="danger"
        />

        <div v-if="canCreateAccountType" :class="USERS_TABLE_ACTIONS_ROW_CLASSES">
          <BaseButton @click="onOpenCreateAccountTypeModal">
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
          :show-search="false"
          :empty-message="USERS_ACCOUNT_TABLE_EMPTY_MESSAGE"
          :current-page="accountPagination.page"
          :total-pages="accountPagination.totalPages"
          @action="onAccountAction"
          @update:current-page="onAccountPageChange"
        />
      </template>

      <CreateUserProfileModal
        v-if="isCreateUserProfileModalOpen"
        @close="isCreateUserProfileModalOpen = false"
        :account-type-options="accountTypeOptions"
        @submit="onCreateUserProfile"
      />


      <UpdateUserProfileModal
        v-if="isUpdateUserProfileModalOpen && selectedUserProfile"
        :account-type-options="accountTypeOptions"
        :initial-values="selectedUserProfile"
        @close="onCloseUpdateUserProfileModal"
        @submit="onUpdateUserProfile"
      />

      <UserPasswordModal
        v-if="isUserPasswordModalOpen"
        @close="onCloseUserPasswordModal"
        @submit="onUpdateUserPassword"
      />

      <ViewUserProfileModal
        v-if="isViewUserProfileModalOpen && selectedUserProfileView"
        :profile="selectedUserProfileView"
        @close="onCloseViewUserProfileModal"
      />

      <CreateAccountTypeModal
        v-if="isAccountTypeModalOpen"
        :privilege-options="privilegeOptions"
        @close="isAccountTypeModalOpen = false"
        @submit="onCreateAccountType"
      />

      <UpdateAccountTypeModal
        v-if="isUpdateAccountTypeModalOpen && selectedAccountType"
        :initial-values="selectedAccountType"
        :privilege-options="privilegeOptions"
        @close="onCloseUpdateAccountTypeModal"
        @submit="onUpdateAccountType"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import UsersFilter from '~/components/users/UsersFilter.vue'
import AccountTypesFilter from '~/components/users/AccountTypesFilter.vue'
import type { FieldValidationMap } from '~/utils/field-validation'
import { useDialog } from '~/composables/useDialog'
import {
  USERS_ACCOUNT_CREATE_BUTTON_LABEL,
  USERS_ACCOUNT_REQUIRED_PERMISSIONS,
  USERS_PAGE_SECTION_CLASSES,
  USERS_PAGE_SUBTITLE,
  USERS_PAGE_TAB_ITEMS,
  USERS_PAGE_TAB_REQUIRED_PERMISSIONS,
  USERS_PAGE_TABS_ARIA_LABEL,
  USERS_PAGE_TITLE,
  USERS_PROFILE_CREATE_BUTTON_LABEL,
  USERS_PROFILE_REQUIRED_PERMISSIONS,
} from '~/constants/page.constants'
import {
 USERS_ACCOUNT_TABLE_ACTIONS,
  USERS_ACCOUNT_TABLE_ACTIONS_COLUMN_LABEL,
  USERS_ACCOUNT_TABLE_COLUMNS,
  USERS_ACCOUNT_TABLE_EMPTY_MESSAGE,
  USERS_ACCOUNT_TABLE_TITLE,
  USERS_PROFILE_TABLE_ACTIONS,
  USERS_PROFILE_TABLE_ACTIONS_COLUMN_LABEL,
  USERS_PROFILE_TABLE_COLUMNS,
  USERS_PROFILE_TABLE_EMPTY_MESSAGE,
  USERS_PROFILE_TABLE_TITLE,
} from '~/constants/table.constants'
import { APP_MAIN_CONTENT_CLASSES } from '~/constants/shared.constants'
import { USERS_PAGE_HEADER_CLASSES, USERS_TABLE_ACTIONS_ROW_CLASSES } from '~/constants/shared.constants'
import { useUsers } from '~/composables/useUsers'
import {
  useAccountTypeActionHandler,
  useCreateAccountTypeHandler,
  useCreateUserProfileHandler,
  useDeleteUserProfileHandler,
  useDeleteAccountTypeHandler,
  useUserActivationHandler,
  useUserPasswordHandler,
  useUsersPageHandlers,
  useViewUserProfileHandler,
  useUpdateAccountTypeHandler,
  useUpdateUserProfileHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'

const {
  activeTab,
  profileFilters,
  accountFilters,
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
  getAccountTypeById,
  updateAccountType,
  deleteAccountType,
  getUserProfileById,
  getUserProfileViewById,
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

const {
  handleTabChange,
  handleProfileFilterApply,
  handleProfileFilterReset,
  handleAccountFilterApply,
  handleAccountFilterReset,
} = useUsersPageHandlers(
  activeTab,
  profileFilters,
  accountFilters
)

const onTabChange = (nextTab: string) => {
  handleTabChange(nextTab)
}

const profileFilterValidationErrors = ref<FieldValidationMap>({})
const accountFilterValidationErrors = ref<FieldValidationMap>({})

const handleApplyProfileFilters = async (value: typeof profileFilters.value) => {
  const { filters, errors, isValid } = handleProfileFilterApply(value)
  profileFilterValidationErrors.value = errors

  if (!isValid) {
    return
  }

  await loadUserProfiles(1, filters)
}

const handleResetProfileFilters = async () => {
  profileFilterValidationErrors.value = {}
  const filters = handleProfileFilterReset()
  await loadUserProfiles(1, filters)
}

const handleApplyAccountFilters = async (value: typeof accountFilters.value) => {
  const { filters, errors, isValid } = handleAccountFilterApply(value)
  accountFilterValidationErrors.value = errors

  if (!isValid) {
    return
  }

  await loadUserAccounts(1, filters)
}

const handleResetAccountFilters = async () => {
  accountFilterValidationErrors.value = {}
  const filters = handleAccountFilterReset()
  await loadUserAccounts(1, filters)
}

const onProfilePageChange = (nextPage: number) => {
  void loadUserProfiles(nextPage, profileFilters.value)
}

const onAccountPageChange = (nextPage: number) => {
  void loadUserAccounts(nextPage, accountFilters.value)
}
const isCreateUserProfileModalOpen = ref(false)
const isUpdateUserProfileModalOpen = ref(false)
const isUserPasswordModalOpen = ref(false)
const isAccountTypeModalOpen = ref(false)
const isUpdateAccountTypeModalOpen = ref(false)
const isViewUserProfileModalOpen = ref(false)
const selectedUserProfileId = ref('')
const selectedUserProfile = ref<{ email: string; fullName: string; avatarUrl: string | null; accountTypeIds: string[] } | null>(null)
const selectedUserProfileView = ref<Awaited<ReturnType<typeof getUserProfileViewById>> | null>(null)
const selectedAccountTypeId = ref('')
const selectedAccountType = ref<{
  code: string
  name: string
  description: string | null
  isSystem: boolean
  permissionIds: string[]
} | null>(null)
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

const { onOpenCreateUserProfileModal, onCreateUserProfile } = useCreateUserProfileHandler({
  accountTypeOptions,
  isCreateUserProfileModalOpen,
  profileWarning,
  loadUserAccounts,
  createUserProfile,
  loadUserProfiles,
})

const { onOpenCreateAccountTypeModal, onCreateAccountType } = useCreateAccountTypeHandler({
  isAccountTypeModalOpen,
  createAccountType,
  loadUserAccounts,
})

const {
  canHandleViewAction,
  onViewProfileAction,
  onCloseViewUserProfileModal,
} = useViewUserProfileHandler({
  selectedUserProfileId,
  selectedUserProfileView,
  isViewUserProfileModalOpen,
  getUserProfileViewById,
})

const {
  canHandleUpdateProfileAction,
  onCloseUpdateUserProfileModal,
  onUpdateUserProfile,
  onEditProfileAction,
} = useUpdateUserProfileHandler({
  accountTypeOptions,
  selectedUserProfileId,
  selectedUserProfile,
  isUpdateUserProfileModalOpen,
  profilePagination,
  profileFilters,
  loadUserAccounts,
  loadUserProfiles,
  getUserProfileById,
  updateUserProfile,
})

const {
  canHandlePasswordAction,
  onCloseUserPasswordModal,
  onUpdateUserPassword,
  onPasswordAction,
} = useUserPasswordHandler({
  selectedUserProfileId,
  isUserPasswordModalOpen,
  updateUserPassword,
})

const { canHandleActivationAction, onActivationAction } = useUserActivationHandler({
  showDialog,
  updateUserActivation,
  loadUserProfiles,
  profilePagination,
  profileFilters,
})

const { canHandleDeleteAction, onDeleteAction } = useDeleteUserProfileHandler({
  showDialog,
  deleteUserProfile,
  loadUserProfiles,
  profilePagination,
  profileFilters,
  profileWarning,
})

const {
  canHandleUpdateAccountTypeAction,
  onEditAccountTypeAction,
  onUpdateAccountType,
  onCloseUpdateAccountTypeModal,
} = useUpdateAccountTypeHandler({
  selectedAccountTypeId,
  selectedAccountType,
  isUpdateAccountTypeModalOpen,
  getAccountTypeById,
  updateAccountType,
  loadUserAccounts,
  accountPagination,
  accountFilters,
})

const { canHandleDeleteAccountTypeAction, onDeleteAccountTypeAction } = useDeleteAccountTypeHandler({
  showDialog,
  deleteAccountType,
  loadUserAccounts,
  accountPagination,
  accountFilters,
})

const { onAccountTypeAction } = useAccountTypeActionHandler({
  canHandleUpdateAccountTypeAction,
  onEditAccountTypeAction,
  canHandleDeleteAccountTypeAction,
  onDeleteAccountTypeAction,
})

const onAccountAction = async (payload: { actionKey: string; row: Record<string, unknown> }) => {
  await onAccountTypeAction(payload)
}

const onProfileAction = async (payload: { actionKey: string; row: Record<string, unknown> }) => {
  profileWarning.value = ''

  if (canHandleViewAction(payload.actionKey)) {
    await onViewProfileAction(payload.row)
    return
  }

  if (canHandleUpdateProfileAction(payload.actionKey)) {
    await onEditProfileAction(payload.row)
    return
  }

  if (canHandlePasswordAction(payload.actionKey)) {
    onPasswordAction(payload.row)
    return
  }

  if (canHandleActivationAction(payload.actionKey)) {
    await onActivationAction(payload.row)
    return
  }

  if (canHandleDeleteAction(payload.actionKey)) {
    await onDeleteAction(payload.row)
  }
}

watch([isAccountTypeModalOpen, isUpdateAccountTypeModalOpen], ([isCreateOpen, isUpdateOpen]) => {
  if (isCreateOpen || isUpdateOpen) {
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
</script>
