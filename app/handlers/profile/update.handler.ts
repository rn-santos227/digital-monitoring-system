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


