import type { Ref } from 'vue'
import type { UpdateApplicationSettingsPayload } from '~/types/domain/application-settings'

interface UseUpdateSettingsHandlerOptions {
  canUpdate: Ref<boolean>
  updateApplicationSettings: (payload: UpdateApplicationSettingsPayload) => Promise<void>
}

export const useUpdateSettingsHandler = ({
  canUpdate,
  updateApplicationSettings,
}: UseUpdateSettingsHandlerOptions) => {
  const onUpdateSettings = async (payload: UpdateApplicationSettingsPayload) => {
    if (!canUpdate.value) {
      return
    }

    await updateApplicationSettings(payload)
  }

  return {
    onUpdateSettings,
  }
}
