import type { Ref } from 'vue'
import { USER_PROFILE_ACTION_KEYS } from './constants'
import type { UpdateUserProfilePayload, UserAccountsSearchQuery, UserProfilesSearchQuery } from '~/types/domain/users'

type UserRow = Record<string, unknown>

interface SelectedUserProfile {
  email: string
  fullName: string
  avatarUrl: string | null
  accountTypeIds: string[]
}

interface UseUpdateUserProfileHandlerOptions {
  accountTypeOptions: Ref<Array<{ value: string; label: string }>>
  selectedUserProfileId: Ref<string>
  selectedUserProfile: Ref<SelectedUserProfile | null>
  isUpdateUserProfileModalOpen: Ref<boolean>
  profilePagination: Ref<{ page: number }>
  profileFilters: Ref<Partial<UserProfilesSearchQuery>>
  loadUserAccounts: (page?: number, filters?: Partial<UserAccountsSearchQuery>) => Promise<void>
  loadUserProfiles: (page?: number, filters?: Partial<UserProfilesSearchQuery>) => Promise<void>
  getUserProfileById: (id: string) => Promise<SelectedUserProfile>
  updateUserProfile: (id: string, payload: UpdateUserProfilePayload) => Promise<void>
}

const resolveProfileActionRowId = (row: UserRow): string => {
  return String(row.id ?? '')
}

export const useUpdateUserProfileHandler = ({
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
}: UseUpdateUserProfileHandlerOptions) => {
  const onCloseUpdateUserProfileModal = () => {
    isUpdateUserProfileModalOpen.value = false
    selectedUserProfileId.value = ''
    selectedUserProfile.value = null
  }

  const onUpdateUserProfile = async (payload: UpdateUserProfilePayload) => {
    if (!selectedUserProfileId.value) {
      return
    }

    await updateUserProfile(selectedUserProfileId.value, payload)
    onCloseUpdateUserProfileModal()
    await loadUserProfiles(profilePagination.value.page, profileFilters.value)
  }

  const onEditProfileAction = async (row: UserRow): Promise<boolean> => {
    const selectedUserId = resolveProfileActionRowId(row)
    if (!selectedUserId) {
      return true
    }

    if (accountTypeOptions.value.length === 0) {
      await loadUserAccounts(1)
    }

    const selected = await getUserProfileById(selectedUserId)
    selectedUserProfileId.value = selectedUserId
    selectedUserProfile.value = {
      email: selected.email,
      fullName: selected.fullName,
      avatarUrl: selected.avatarUrl,
      accountTypeIds: selected.accountTypeIds,
    }
    isUpdateUserProfileModalOpen.value = true
    return true
  }

  const canHandleUpdateProfileAction = (actionKey: string): boolean => {
    return actionKey === USER_PROFILE_ACTION_KEYS.edit
  }

  return {
    canHandleUpdateProfileAction,
    onCloseUpdateUserProfileModal,
    onUpdateUserProfile,
    onEditProfileAction,
  }
}
