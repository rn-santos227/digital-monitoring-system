import type { UserManagementTabId } from '~/types/domain/users'

export const USER_MANAGEMENT_TAB_IDS: readonly UserManagementTabId[] = ['user-profile', 'user-account']

export const USER_PROFILE_ACTION_KEYS = Object.freeze({
  edit: 'edit-user-profile',
  password: 'change-user-password',
  activation: 'toggle-user-activation',
  delete: 'delete-user-profile',
})
