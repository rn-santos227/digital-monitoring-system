import type { Ref } from 'vue'
import type { UserManagementTabId } from '~/types/domain/users'
import type { DialogInput } from '~/composables/useDialog'

export const USER_MANAGEMENT_TAB_IDS: readonly UserManagementTabId[] = ['user-profile', 'user-account']
export const USER_PROFILE_ACTION_KEYS = Object.freeze({
  edit: 'edit-user-profile',
  password: 'change-user-password',
  activation: 'toggle-user-activation',
  delete: 'delete-user-profile',
})

export const useUsersPageHandlers = (
  activeTab: Ref<UserManagementTabId>,
  profileSearchQuery: Ref<string>,
  accountSearchQuery: Ref<string>
) => {
  const handleTabChange = (nextTab: string) => {
    if (USER_MANAGEMENT_TAB_IDS.includes(nextTab as UserManagementTabId)) {
      activeTab.value = nextTab as UserManagementTabId
    }
  }

  const handleProfileSearch = (value: string) => {
    profileSearchQuery.value = value
  }

  const handleAccountSearch = (value: string) => {
    accountSearchQuery.value = value
  }

  return {
    handleTabChange,
    handleProfileSearch,
    handleAccountSearch,
  }
}

export const resolveProfileActionRowId = (row: Record<string, unknown>): string => {
  return String(row.id ?? '')
}

export const resolveProfileActionRowIsActive = (row: Record<string, unknown>): boolean => {
  return String(row.status ?? '').toLowerCase() === 'active'
}

export const buildActivationDialog = (isCurrentlyActive: boolean): DialogInput => {
  return {
    type: 'question',
    title: `${isCurrentlyActive ? 'Deactivate' : 'Activate'} user profile?`,
    message: `Are you sure you want to ${isCurrentlyActive ? 'deactivate' : 'activate'} this user profile?`,
    confirmLabel: isCurrentlyActive ? 'Deactivate' : 'Activate',
    cancelLabel: 'Cancel',
  }
}

export const DELETE_PROFILE_DIALOG: DialogInput = Object.freeze({
  type: 'warning',
  title: 'Delete user profile?',
  message: 'This action cannot be undone. Do you want to continue?',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
})
