import { defineStore } from 'pinia'
import type { DefineStoreOptions } from 'pinia'
import type {
  ProfileDetailsPayload,
  ProfileEmailPayload,
  ProfileOtherDetailsPayload,
  ProfilePasswordPayload,
  ProfileSettingsState,
  ProfileSettingsTabId,
} from '~/types/domain/profile'
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

interface ProfileSettingsGetters {
  isPasswordTab: (state: ProfileSettingsState) => boolean
}

interface ProfileSettingsActions {
  openSettings(tab?: ProfileSettingsTabId): void
  closeSettings(): void
  setActiveTab(tab: ProfileSettingsTabId): void
  saveDetails(userId: string, payload: ProfileDetailsPayload): Promise<void>
  saveEmail(userId: string, payload: ProfileEmailPayload): Promise<void>
  saveOtherDetails(userId: string, payload: ProfileOtherDetailsPayload): Promise<void>
  savePassword(userId: string, payload: ProfilePasswordPayload): Promise<void>
  runSubmission(action: () => Promise<{ ok: true }>): Promise<void>
}

const profileSettingsStoreOptions: DefineStoreOptions<
  'profile',
  ProfileSettingsState,
  ProfileSettingsGetters,
  ProfileSettingsActions
> = {
  id: 'profile',
  state: (): ProfileSettingsState => ({ ...INITIAL_PROFILE_SETTINGS_STATE }),

  getters: {
    isPasswordTab: (state: ProfileSettingsState) => state.activeTab === 'password',
  },

  actions: {
    openSettings(tab: ProfileSettingsTabId = 'details') {
      this.isOpen = true
      this.activeTab = tab
      this.error = ''
      this.warning = ''
    },

    closeSettings() {
      this.isOpen = false
      this.error = ''
      this.warning = ''
    },

    setActiveTab(tab: ProfileSettingsTabId) {
      this.activeTab = tab
      this.error = ''
      this.warning = ''
    },

    async saveDetails(userId: string, payload: ProfileDetailsPayload) {
      await this.runSubmission(() => updateProfileDetailsEndpoint(userId, payload))
    },

    async saveEmail(userId: string, payload: ProfileEmailPayload) {
      await this.runSubmission(() => updateProfileEmailEndpoint(userId, payload))
    },

    async saveOtherDetails(userId: string, payload: ProfileOtherDetailsPayload) {
      await this.runSubmission(() => updateProfileOtherDetailsEndpoint(userId, payload))
    },

    async savePassword(userId: string, payload: ProfilePasswordPayload) {
      await this.runSubmission(() => updateProfilePasswordEndpoint(userId, payload))
    },

    async runSubmission(action: () => Promise<{ ok: true }>) {
      this.isSubmitting = true
      this.error = ''

      try {
        await action()
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update profile settings right now.')
        throw error
      } finally {
        this.isSubmitting = false
      }
    },
  },
}

export const useProfileStore = defineStore('profile', profileSettingsStoreOptions)
