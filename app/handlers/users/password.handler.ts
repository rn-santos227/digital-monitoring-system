import type { Ref } from 'vue'
import { USER_PROFILE_ACTION_KEYS } from './constants'
import type { UpdateUserPasswordPayload } from '~/types/domain/users'

type UserRow = Record<string, unknown>

const resolveProfileActionRowId = (row: UserRow): string => {
  return String(row.id ?? '')
}

interface UseUserPasswordHandlerOptions {
  selectedUserProfileId: Ref<string>
  isUserPasswordModalOpen: Ref<boolean>
  updateUserPassword: (id: string, payload: UpdateUserPasswordPayload) => Promise<void>
}

export const useUserPasswordHandler = ({
  selectedUserProfileId,
  isUserPasswordModalOpen,
  updateUserPassword,
}: UseUserPasswordHandlerOptions) => {
  const onCloseUserPasswordModal = () => {
    isUserPasswordModalOpen.value = false
    selectedUserProfileId.value = ''
  }

  const onUpdateUserPassword = async (payload: UpdateUserPasswordPayload) => {
    if (!selectedUserProfileId.value) {
      return
    }

    await updateUserPassword(selectedUserProfileId.value, payload)
    onCloseUserPasswordModal()
  }

  const onPasswordAction = (row: UserRow): boolean => {
    const selectedUserId = resolveProfileActionRowId(row)
    if (!selectedUserId) {
      return true
    }

    selectedUserProfileId.value = selectedUserId
    isUserPasswordModalOpen.value = true
    return true
  }

  const canHandlePasswordAction = (actionKey: string): boolean => {
    return actionKey === USER_PROFILE_ACTION_KEYS.password
  }

  return {
    canHandlePasswordAction,
    onCloseUserPasswordModal,
    onUpdateUserPassword,
    onPasswordAction,
  }
}
