import type { Ref } from 'vue'
import { USER_PROFILE_ACTION_KEYS } from './constants'
import type { UserProfileViewRecord } from '~/types/domain/users'

type UserRow = Record<string, unknown>

const resolveProfileActionRowId = (row: UserRow): string => {
  return String(row.id ?? '')
}

interface UseViewUserProfileHandlerOptions {
  selectedUserProfileId: Ref<string>
  selectedUserProfileView: Ref<UserProfileViewRecord | null>
  isViewUserProfileModalOpen: Ref<boolean>
  getUserProfileViewById: (id: string) => Promise<UserProfileViewRecord>
}

export const useViewUserProfileHandler = ({
  selectedUserProfileId,
  selectedUserProfileView,
  isViewUserProfileModalOpen,
  getUserProfileViewById,
}: UseViewUserProfileHandlerOptions) => {
  const onCloseViewUserProfileModal = () => {
    isViewUserProfileModalOpen.value = false
    selectedUserProfileId.value = ''
    selectedUserProfileView.value = null
  }

  const onViewProfileAction = async (row: UserRow): Promise<boolean> => {
    const selectedUserId = resolveProfileActionRowId(row)
    if (!selectedUserId) {
      return true
    }

    const profile = await getUserProfileViewById(selectedUserId)
    selectedUserProfileId.value = selectedUserId
    selectedUserProfileView.value = profile
    isViewUserProfileModalOpen.value = true
    return true
  }

  const canHandleViewAction = (actionKey: string): boolean => {
    return actionKey === USER_PROFILE_ACTION_KEYS.view
  }

  return {
    canHandleViewAction,
    onViewProfileAction,
    onCloseViewUserProfileModal,
  }
}
