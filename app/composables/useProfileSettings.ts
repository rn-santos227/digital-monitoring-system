import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useProfileSettingsUpdateHandler } from '~/handlers/profile'
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
import type {
  ProfileDetailsPayload,
  ProfileEmailPayload,
  ProfileOtherDetailsPayload,
  ProfilePasswordPayload,
  ProfileSettingsTabId,
} from '~/types/domain/profile'

export const useProfileSettings = () => {
  const authStore = useAuthStore()
  const profileSettingsStore = useProfileStore()
  const { currentUser } = storeToRefs(authStore)
  const { activeTab, error, isOpen, isSubmitting, warning } = storeToRefs(profileSettingsStore)
  const userId = computed(() => currentUser.value?.id ?? '')

  const handler = useProfileSettingsUpdateHandler({
    refreshSession: () => authStore.fetchSession(),
    saveDetails: (payload: ProfileDetailsPayload) => profileSettingsStore.saveDetails(userId.value, payload),
    saveEmail: (payload: ProfileEmailPayload) => profileSettingsStore.saveEmail(userId.value, payload),
    saveOtherDetails: (payload: ProfileOtherDetailsPayload) => profileSettingsStore.saveOtherDetails(userId.value, payload),
    savePassword: (payload: ProfilePasswordPayload) => profileSettingsStore.savePassword(userId.value, payload),
  })

  return {
    activeTab,
    currentUser,
    error,
    isOpen,
    isSubmitting,
    warning,
    closeSettings: profileSettingsStore.closeSettings,
    openSettings: (tab?: ProfileSettingsTabId) => profileSettingsStore.openSettings(tab),
    setActiveTab: profileSettingsStore.setActiveTab,
    ...handler,
  }
}
