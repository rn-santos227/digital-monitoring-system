import { defineStore } from 'pinia'
import type { ProfileSettingsState, ProfileSettingsTabId } from '~/types/domain/profile'
import {
  updateProfileDetailsEndpoint,
  updateProfileEmailEndpoint,
  updateProfileOtherDetailsEndpoint,
  updateProfilePasswordEndpoint,
} from '~/utils/profile-settings-endpoints'
import { extractApiErrorMessage } from '~/utils/api-request'


