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

        <UsersFilter
          :model-value="profileFilters"
          :validation-errors="profileFilterValidationErrors"
          @apply="handleApplyProfileFilters"
          @reset="handleResetProfileFilters"
        />

        <UsersTable
          :rows="profileTableRows"
          :is-loading="isLoading"
          :current-page="profilePagination.page"
          :total-pages="profilePagination.totalPages"
          :total-items="profilePagination.totalItems"
          :page-size="profilePagination.pageSize"
          @action="onProfileAction"
          @update:current-page="onProfilePageChange"
          @update:page-size="onProfilePageSizeChange"
        />
      </template>

      <template v-else>

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

        <AccountTypesFilter
          :model-value="accountFilters"
          :validation-errors="accountFilterValidationErrors"
          @apply="handleApplyAccountFilters"
          @reset="handleResetAccountFilters"
        />

        <AccountTypesTable
          :rows="accountTableRows"
          :is-loading="isLoading"
          :current-page="accountPagination.page"
          :total-pages="accountPagination.totalPages"
          :total-items="accountPagination.totalItems"
          :page-size="accountPagination.pageSize"
          @action="onAccountAction"
          @update:current-page="onAccountPageChange"
          @update:page-size="onAccountPageSizeChange"

        />
      </template>

      <CreateUserProfileModal
        v-if="isCreateUserProfileModalOpen"
        @close="isCreateUserProfileModalOpen = false"
        :account-type-options="accountTypeOptions"
        @submit="onCreateUserProfileWithFeedback"
      />


      <UpdateUserProfileModal
        v-if="isUpdateUserProfileModalOpen && selectedUserProfile"
        :account-type-options="accountTypeOptions"
        :initial-values="selectedUserProfile"
        @close="onCloseUpdateUserProfileModal"
        @submit="onUpdateUserProfileWithFeedback"
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
        @submit="onCreateAccountTypeWithFeedback"
      />

      <UpdateAccountTypeModal
        v-if="isUpdateAccountTypeModalOpen && selectedAccountType"
        :initial-values="selectedAccountType"
        :privilege-options="privilegeOptions"
        @close="onCloseUpdateAccountTypeModal"
        @submit="onUpdateAccountTypeWithFeedback"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { KpiCardLoaderResult } from '~/components/general/KpiCard.vue'
import KpiCard from '~/components/general/KpiCard.vue'
import UsersFilter from '~/components/users/UsersFilter.vue'
import AccountTypesFilter from '~/components/users/AccountTypesFilter.vue'
import UsersTable from '~/components/users/UsersTable.vue'
import AccountTypesTable from '~/components/users/AccountTypesTable.vue'
import type { FieldValidationMap } from '~/utils/field-validation'
import { createModalFeedbackHandler } from '~/utils/modal-feedback'
import { useDialog } from '~/composables/useDialog'
import { useToast } from '~/composables/useToast'
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
  APP_MAIN_CONTENT_CLASSES,
  USERS_PAGE_HEADER_CLASSES,
  USERS_TABLE_ACTIONS_ROW_CLASSES,
} from '~/constants/shared.constants'
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
const { addToast } = useToast()

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

const loadActiveUsersKpi = async (): Promise<KpiCardLoaderResult> => {
  await loadUserProfiles(1, profileFilters.value, profilePagination.value.pageSize)

  const activeUsersCount = profileTableRows.value.filter(profile => profile.status === 'Active').length

  return {
    value: activeUsersCount.toLocaleString(),
    context: 'User profiles with active login status.',
  }
}

const loadInactiveUsersKpi = async (): Promise<KpiCardLoaderResult> => {
  await loadUserProfiles(1, profileFilters.value, profilePagination.value.pageSize)

  const inactiveUsersCount = profileTableRows.value.filter(profile => profile.status === 'Inactive').length

  return {
    value: inactiveUsersCount.toLocaleString(),
    context: 'User profiles with inactive login status.',
  }
}


const loadUnusedAccountTypesKpi = async (): Promise<KpiCardLoaderResult> => {
  await Promise.all([
    loadUserAccounts(1, accountFilters.value, accountPagination.value.pageSize),
    loadUserProfiles(1, profileFilters.value, profilePagination.value.pageSize),
  ])

  const usedAccountTypeCodes = new Set(
    profileTableRows.value
      .flatMap(profile => profile.accountTypes.split(','))
      .map(accountTypeCode => accountTypeCode.trim())
      .filter(accountTypeCode => accountTypeCode.length > 0 && accountTypeCode !== 'No account type'),
  )

  const unusedAccountTypeCount = accountTableRows.value.filter(
    accountType => !usedAccountTypeCodes.has(accountType.code),
  ).length

  return {
    value: unusedAccountTypeCount.toLocaleString(),
    context: 'Account types with no linked user profiles.',
  }
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

const onProfilePageSizeChange = (nextPageSize: number) => {
  void loadUserProfiles(1, profileFilters.value, nextPageSize)
}

const onAccountPageSizeChange = (nextPageSize: number) => {
  void loadUserAccounts(1, accountFilters.value, nextPageSize)
}

const isCreateUserProfileModalOpen = ref(false)
const isUpdateUserProfileModalOpen = ref(false)
const isUserPasswordModalOpen = ref(false)
const isAccountTypeModalOpen = ref(false)
const isUpdateAccountTypeModalOpen = ref(false)
const isViewUserProfileModalOpen = ref(false)
const selectedUserProfileId = ref('')
const selectedUserProfile = ref<{ personnelId: string | null; email: string; fullName: string; avatarUrl: string | null; accountTypeIds: string[] } | null>(null)
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

const { onOpenCreateUserProfileModal, onCreateUserProfile } = useCreateUserProfileHandler({
  accountTypeOptions,
  isCreateUserProfileModalOpen,
  profileWarning,
  loadUserAccounts,
  createUserProfile,
})

const { onOpenCreateAccountTypeModal, onCreateAccountType } = useCreateAccountTypeHandler({
  isAccountTypeModalOpen,
  createAccountType,
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
  loadUserAccounts,
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
})

const { canHandleDeleteAction, onDeleteAction } = useDeleteUserProfileHandler({
  showDialog,
  deleteUserProfile,
  profileWarning,
  onDeleteSuccess: async () => { await showDialog({
    type: 'success',
    title: 'User profile deleted',
    message: 'User profile has been deleted successfully.',
    confirmLabel: 'OK',
  }) },
  onDeleteCancelled: async () => { addToast({
    variant: 'warning',
    title: 'Delete cancelled',
    message: 'User profile deletion was cancelled.',
  }) },
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
})

const { canHandleDeleteAccountTypeAction, onDeleteAccountTypeAction } = useDeleteAccountTypeHandler({
  showDialog,
  deleteAccountType,
  onDeleteSuccess: async () => { await showDialog({
    type: 'success',
    title: 'Account type deleted',
    message: 'Account type has been deleted successfully.',
    confirmLabel: 'OK',
  }) },
  onDeleteCancelled: async () => { addToast({
    variant: 'warning',
    title: 'Delete cancelled',
    message: 'Account type deletion was cancelled.',
  }) },
})

const onCreateUserProfileWithFeedback = createModalFeedbackHandler(onCreateUserProfile, showDialog, {
  successTitle: 'User profile created',
  successMessage: 'User profile has been created successfully.',
  errorTitle: 'Create failed',
  errorMessage: 'Unable to create user profile right now.',
})

const onUpdateUserProfileWithFeedback = createModalFeedbackHandler(onUpdateUserProfile, showDialog, {
  successTitle: 'User profile updated',
  successMessage: 'User profile has been updated successfully.',
  errorTitle: 'Update failed',
  errorMessage: 'Unable to update user profile right now.',
})

const onCreateAccountTypeWithFeedback = createModalFeedbackHandler(onCreateAccountType, showDialog, {
  successTitle: 'Account type created',
  successMessage: 'Account type has been created successfully.',
  errorTitle: 'Create failed',
  errorMessage: 'Unable to create account type right now.',
})

const onUpdateAccountTypeWithFeedback = createModalFeedbackHandler(onUpdateAccountType, showDialog, {
  successTitle: 'Account type updated',
  successMessage: 'Account type has been updated successfully.',
  errorTitle: 'Update failed',
  errorMessage: 'Unable to update account type right now.',
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
