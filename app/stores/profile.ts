import { defineStore } from 'pinia'
import type { ProfileSettingsState, ProfileSettingsTabId } from '~/types/domain/profile'
import {
  updateProfileDetailsEndpoint,
  updateProfileEmailEndpoint,
  updateProfileOtherDetailsEndpoint,
  updateProfilePasswordEndpoint,
} from '~/utils/profile-settings-endpoints'
import { extractApiErrorMessage } from '~/utils/api-request'

const INITIAL_PROFILE_SETTINGS_STATE: ProfileSettingsState = {
  isOpen: false,
  activeTab: 'details',
  isSubmitting: false,
  error: '',
  warning: '',
}

