import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import { USER_PROFILE_ACTION_KEYS } from './constants'

type UserRow = Record<string, unknown>

const resolveProfileActionRowId = (row: UserRow): string => {
  return String(row.id ?? '')
}

const resolveProfileActionRowIsActive = (row: UserRow): boolean => {
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

interface UseUserActivationHandlerOptions {
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  updateUserActivation: (id: string, payload: { isActive: boolean }) => Promise<void>
  loadUserProfiles: (page?: number, search?: string) => Promise<void>
  profilePagination: Ref<{ page: number }>
  profileSearchQuery: Ref<string>
}

export const useUserActivationHandler = ({
  showDialog,
  updateUserActivation,
  loadUserProfiles,
  profilePagination,
  profileSearchQuery,
}: UseUserActivationHandlerOptions) => {
  const onActivationAction = async (row: UserRow): Promise<boolean> => {
    const selectedUserId = resolveProfileActionRowId(row)
    if (!selectedUserId) {
      return true
    }

    const isCurrentlyActive = resolveProfileActionRowIsActive(row)
    const result = await showDialog(buildActivationDialog(isCurrentlyActive))

    if (!result.confirmed) {
      return true
    }

    await updateUserActivation(selectedUserId, { isActive: !isCurrentlyActive })
    await loadUserProfiles(profilePagination.value.page, profileSearchQuery.value)
    return true
  }

  const canHandleActivationAction = (actionKey: string): boolean => {
    return actionKey === USER_PROFILE_ACTION_KEYS.activation
  }

  return {
    canHandleActivationAction,
    onActivationAction,
  }
}
