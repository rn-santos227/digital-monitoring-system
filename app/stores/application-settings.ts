import { defineStore } from 'pinia'
import type { ApplicationSettingsState, UpdateApplicationSettingsPayload } from '~/types/domain/application-settings'
import { extractApiErrorMessage } from '~/utils/api-request'
import { getApplicationSettingsEndpoint, updateApplicationSettingsEndpoint } from '~/utils/application-settings-endpoints'
import { loadApplicationSettingsFromStorage, saveApplicationSettingsToStorage } from '~/utils/application-settings-storage'

const loadInitialApplicationSettingsItem = () => {
  if (!import.meta.client) {
    return null
  }

  return loadApplicationSettingsFromStorage()
}

const initialApplicationSettingsItem = loadInitialApplicationSettingsItem()

const INITIAL_APPLICATION_SETTINGS_STATE: ApplicationSettingsState = {
  item: initialApplicationSettingsItem,
  hasLoaded: Boolean(initialApplicationSettingsItem),
  isLoading: false,
  isSubmitting: false,
  loadError: '',
  updateError: '',
}

const applicationSettingsStoreOptions = {
  state: (): ApplicationSettingsState => ({ ...INITIAL_APPLICATION_SETTINGS_STATE }),

  getters: {
    hasSettings: (state: ApplicationSettingsState) => Boolean(state.item),
  },

  actions: {
    async initialize(this: ApplicationSettingsState) {
      if (this.hasLoaded) {
        return
      }

      this.isLoading = true
      this.loadError = ''

      const storedItem = loadApplicationSettingsFromStorage()
      if (storedItem) {
        this.item = storedItem
        this.hasLoaded = true
        this.isLoading = false
        return
      }

      try {
        const response = await getApplicationSettingsEndpoint()
        this.item = response.item
        saveApplicationSettingsToStorage(response.item)
      } catch (error) {
        this.loadError = extractApiErrorMessage(error, 'Unable to load application settings.')
        this.hasLoaded = false
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async update(this: ApplicationSettingsState, payload: UpdateApplicationSettingsPayload) {
      this.isSubmitting = true
      this.updateError = ''

      try {
        const response = await updateApplicationSettingsEndpoint(payload)
        this.item = response.item
        saveApplicationSettingsToStorage(response.item)
        return response
      } catch (error) {
        this.updateError = extractApiErrorMessage(error, 'Unable to update application settings.')
        throw error
      } finally {
        this.isSubmitting = false
      }
    },
  },
}

export const useApplicationSettingsStore = defineStore('application-settings', applicationSettingsStoreOptions)
