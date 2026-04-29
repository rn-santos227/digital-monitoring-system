import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import { USER_PROFILE_ACTION_KEYS } from './constants'
import type { UserProfilesSearchQuery } from '~/types/domain/users'

type UserRow = Record<string, unknown>

const resolveProfileActionRowId = (row: UserRow): string => {
  return String(row.id ?? '')
}

export const DELETE_PROFILE_DIALOG: DialogInput = Object.freeze({
  type: 'warning',
  title: 'Delete user profile?',
  message: 'This action cannot be undone. Do you want to continue?',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
})


interface UseDeleteUserProfileHandlerOptions {
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  deleteUserProfile: (id: string) => Promise<void>
  loadUserProfiles: (page?: number, filters?: Partial<UserProfilesSearchQuery>) => Promise<void>
  profilePagination: Ref<{ page: number }>
  profileFilters: Ref<Partial<UserProfilesSearchQuery>>
  profileWarning: Ref<string>
  onDeleteSuccess?: () => void | Promise<void>
  onDeleteCancelled?: () => void | Promise<void>
}

export const useDeleteUserProfileHandler = ({
  showDialog,
  deleteUserProfile,
  loadUserProfiles,
  profilePagination,
  profileFilters,
  profileWarning,
  onDeleteSuccess,
  onDeleteCancelled,
}: UseDeleteUserProfileHandlerOptions) => {
  const onDeleteAction = async (row: UserRow): Promise<boolean> => {
    const selectedUserId = resolveProfileActionRowId(row)
    if (!selectedUserId) {
      return true
    }

    const result = await showDialog(DELETE_PROFILE_DIALOG)
    if (!result.confirmed) {
      await onDeleteCancelled?.()
      return true
    }

    try {
      await deleteUserProfile(selectedUserId)
      await loadUserProfiles(profilePagination.value.page, profileFilters.value)
      await onDeleteSuccess?.()
    } catch {
      profileWarning.value = 'Delete endpoint is currently unavailable. Please use deactivate for access control.'
    }

    return true
  }

  const canHandleDeleteAction = (actionKey: string): boolean => {
    return actionKey === USER_PROFILE_ACTION_KEYS.delete
  }

  return {
    canHandleDeleteAction,
    onDeleteAction,
  }
}
