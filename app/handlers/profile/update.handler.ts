import { useDialog } from '~/composables/useDialog'
import {
  PROFILE_SETTINGS_PASSWORD_CONFIRMATION_MESSAGE,
  PROFILE_SETTINGS_SUCCESS_MESSAGE,
} from '~/constants/page.constants'
import type {
  ProfileDetailsPayload,
  ProfileEmailPayload,
  ProfileOtherDetailsPayload,
  ProfilePasswordPayload,
} from '~/types/domain/profile'
import { showErrorDialog } from '~/utils/error-handling'

interface UseProfileSettingsUpdateHandlerOptions {
  refreshSession: () => Promise<void>
  saveDetails: (payload: ProfileDetailsPayload) => Promise<void>
  saveEmail: (payload: ProfileEmailPayload) => Promise<void>
  saveOtherDetails: (payload: ProfileOtherDetailsPayload) => Promise<void>
  savePassword: (payload: ProfilePasswordPayload) => Promise<void>
}

export const useProfileSettingsUpdateHandler = ({
  refreshSession,
  saveDetails,
  saveEmail,
  saveOtherDetails,
  savePassword,
}: UseProfileSettingsUpdateHandlerOptions) => {
  const { showDialog } = useDialog()

  const showSuccess = async () => {
    await refreshSession()
    await showDialog({
      type: 'success',
      title: 'Profile updated',
      message: PROFILE_SETTINGS_SUCCESS_MESSAGE,
      confirmLabel: 'OK',
    })
  }

  const handleFailure = async (error: unknown) => {
    await showErrorDialog({
      showDialog,
      title: 'Unable to update profile',
      error,
      fallbackMessage: 'Unable to update your profile settings right now.',
    })
  }

  const onSaveDetails = async (payload: ProfileDetailsPayload) => {
    try {
      await saveDetails(payload)
      await showSuccess()
    } catch (error) {
      await handleFailure(error)
    }
  }
}
