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


}
