<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="USERS_PAGE_SECTION_CLASSES">
      <header :class="USERS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ USERS_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ USERS_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="USERS_PAGE_KPI_GRID_CLASSES">
          <KpiCard
            title="Total Active Users"
            subtitle="User profiles currently marked as active."
            icon-name="check-circle"
            tone="emerald"
            :value="activeUsersKpi"
            context="User profiles with active login status."
          />
          <KpiCard
            title="Total Inactive Users"
            subtitle="User profiles currently marked as inactive."
            icon-name="x-circle"
            tone="amber"
            :value="inactiveUsersKpi"
            context="User profiles with inactive login status."
          />
          <KpiCard
            title="Unused Account Types"
            subtitle="Account types with no user profile assignments."
            icon-name="archive"
            tone="amber"
            :value="unusedAccountTypesKpi"
            context="Account types with no linked user profiles."
          />
      </div>

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

        <div :class="USERS_TABLE_ACTIONS_ROW_CLASSES">
          <PrintDataListButton
            table-name="user_profiles"
            table-label="User Profiles"
            :filters="profileFilters"
            :disabled="isLoading"
            :get-print-data="handlePrintUserProfiles"
          />
          <BaseButton v-if="canCreateUserProfile" @click="onOpenCreateUserProfileModal">
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
          v-model:selected-row-keys="selectedUserProfileIds"
          @bulk-delete="deleteSelectedUsers"
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

        <div :class="USERS_TABLE_ACTIONS_ROW_CLASSES">
          <PrintDataListButton
            table-name="account_types"
            table-label="Account Types"
            :filters="accountFilters"
            :disabled="isLoading"
            :get-print-data="handlePrintAccountTypes"
          />
          <BaseButton v-if="canCreateAccountType" @click="onOpenCreateAccountTypeModal">
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
          v-model:selected-row-keys="selectedAccountTypeIds"
          @bulk-delete="deleteSelectedAccountTypes"
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
import KpiCard from '~/components/general/KpiCard.vue'
import PrintDataListButton from '~/components/general/PrintDataListButton.vue'
import UsersFilter from '~/components/users/UsersFilter.vue'
import AccountTypesFilter from '~/components/users/AccountTypesFilter.vue'
import UsersTable from '~/components/users/UsersTable.vue'
import AccountTypesTable from '~/components/users/AccountTypesTable.vue'
import BulkUpdateUsersModal from '~/components/users/BulkUpdateUsersModal.vue'
import BulkUpdateAccountTypesModal from '~/components/users/BulkUpdateAccountTypesModal.vue'
import type { FieldValidationMap } from '~/utils/field-validation'
import { createModalFeedbackHandler } from '~/utils/modal-feedback'
import { useDialog } from '~/composables/useDialog'
import { useToast } from '~/composables/useToast'
import {
  USERS_ACCOUNT_CREATE_BUTTON_LABEL,
  USERS_ACCOUNT_REQUIRED_PERMISSIONS,
  USERS_PAGE_SECTION_CLASSES,
  USERS_PAGE_KPI_GRID_CLASSES,
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
  useBulkDeleteUsersHandler,
  useBulkDeleteAccountTypesHandler,
  useBulkUpdateUsersHandler,
  useBulkUpdateAccountTypesHandler,
  useDeleteAccountTypeHandler,
  useUserActivationHandler,
  useUserPasswordHandler,
  useUserProfileActionHandler,
  useUsersPageHandlers,
  useValidatedListHandlers,
  useViewUserProfileHandler,
  useUpdateAccountTypeHandler,
  useUpdateUserProfileHandler,
  usePrintUsersHandler,
  usePrintAccountTypesHandler,
  createCompleteListPrintHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'

const {
  activeTab,
  profileFilters,
  accountFilters,
  profileTableRows,
  accountTableRows,
  kpis,
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

const { printUserProfiles } = usePrintUsersHandler()
const { printAccountTypes } = usePrintAccountTypesHandler()

const handlePrintUserProfiles = createCompleteListPrintHandler({
  rows: profileTableRows,
  pagination: profilePagination,
  loadPage: (page, pageSize) => loadUserProfiles(page, profileFilters.value, pageSize),
  printItems: printUserProfiles,
})

const handlePrintAccountTypes = createCompleteListPrintHandler({
  rows: accountTableRows,
  pagination: accountPagination,
  loadPage: (page, pageSize) => loadUserAccounts(page, accountFilters.value, pageSize),
  printItems: printAccountTypes,
})

const authStore = useAuthStore()
const { showDialog } = useDialog()
const { addToast } = useToast()
const selectedUserProfileIds = ref<string[]>([])
const selectedAccountTypeIds = ref<string[]>([])
const isBulkUpdateUsersModalOpen = ref(false)
const isBulkUpdateAccountTypesModalOpen = ref(false)
const bulkUpdateUsersError = ref('')
const bulkUpdateAccountTypesError = ref('')

const { deleteSelectedUsers } = useBulkDeleteUsersHandler({
  selectedIds: selectedUserProfileIds,
  reload: () => loadUserProfiles(),
  showDialog,
})
const { deleteSelectedAccountTypes } = useBulkDeleteAccountTypesHandler({
  selectedIds: selectedAccountTypeIds,
  reload: () => loadUserAccounts(),
  showDialog,
})
const {
  openBulkUpdateUsersModal,
  closeBulkUpdateUsersModal,
  updateSelectedUsers,
} = useBulkUpdateUsersHandler({
  selectedIds: selectedUserProfileIds,
  isModalOpen: isBulkUpdateUsersModalOpen,
  errorMessage: bulkUpdateUsersError,
  reload: () => loadUserProfiles(),
  showDialog,
})
const {
  openBulkUpdateAccountTypesModal,
  closeBulkUpdateAccountTypesModal,
  updateSelectedAccountTypes,
} = useBulkUpdateAccountTypesHandler({
  selectedIds: selectedAccountTypeIds,
  isModalOpen: isBulkUpdateAccountTypesModalOpen,
  errorMessage: bulkUpdateAccountTypesError,
  reload: () => loadUserAccounts(),
  showDialog,
})

watch(profileTableRows, (rows) => {
  const visibleIds = new Set(rows.map((row) => String(row.id ?? '')))
  selectedUserProfileIds.value = selectedUserProfileIds.value.filter((id) => visibleIds.has(id))
})
watch(accountTableRows, (rows) => {
  const visibleIds = new Set(rows.map((row) => String(row.id ?? '')))
  selectedAccountTypeIds.value = selectedAccountTypeIds.value.filter((id) => visibleIds.has(id))
})

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

const onTabChange = handleTabChange

const activeUsersKpi = computed(() => kpis.value.activeUsers)
const inactiveUsersKpi = computed(() => kpis.value.inactiveUsers)
const unusedAccountTypesKpi = computed(() => kpis.value.unusedAccountTypes)

const profileFilterValidationErrors = ref<FieldValidationMap>({})
const accountFilterValidationErrors = ref<FieldValidationMap>({})

const {
  handleApplyFilters: handleApplyProfileFilters,
  handleResetFilters: handleResetProfileFilters,
  handlePageChange: onProfilePageChange,
  handlePageSizeChange: onProfilePageSizeChange,
} = useValidatedListHandlers({
  filters: profileFilters,
  validationErrors: profileFilterValidationErrors,
  applyFilters: handleProfileFilterApply,
  resetFilters: handleProfileFilterReset,
  loadPage: loadUserProfiles,
})

const {
  handleApplyFilters: handleApplyAccountFilters,
  handleResetFilters: handleResetAccountFilters,
  handlePageChange: onAccountPageChange,
  handlePageSizeChange: onAccountPageSizeChange,
} = useValidatedListHandlers({
  filters: accountFilters,
  validationErrors: accountFilterValidationErrors,
  applyFilters: handleAccountFilterApply,
  resetFilters: handleAccountFilterReset,
  loadPage: loadUserAccounts,
})

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

const onAccountAction = onAccountTypeAction
const { onProfileAction } = useUserProfileActionHandler({
  profileWarning,
  canHandleViewAction,
  onViewProfileAction,
  canHandleUpdateProfileAction,
  onEditProfileAction,
  canHandlePasswordAction,
  onPasswordAction,
  canHandleActivationAction,
  onActivationAction,
  canHandleDeleteAction,
  onDeleteAction,
})

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
