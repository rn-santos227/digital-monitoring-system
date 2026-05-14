import type { Ref } from 'vue'
import { ref } from 'vue'
import type { UpdateApplicationSettingsPayload } from '~/types/domain/application-settings'
import { validateApplicationSettingsUpdate } from '~/utils/application-settings-validation'

interface UseUpdateSettingsHandlerOptions {
  canUpdate: Ref<boolean>
  updateApplicationSettings: (payload: UpdateApplicationSettingsPayload) => Promise<void>
}

export const useUpdateSettingsHandler = ({
  canUpdate,
  updateApplicationSettings,
}: UseUpdateSettingsHandlerOptions) => {
  const validationError = ref('')

  const onUpdateSettings = async (payload: UpdateApplicationSettingsPayload) => {
    validationError.value = ''

    if (!canUpdate.value) {
      return
    }

    const updateValidationError = validateApplicationSettingsUpdate(payload)
    if (updateValidationError) {
      validationError.value = updateValidationError
      return
    }

    await updateApplicationSettings(payload)
  }

  return {
    onUpdateSettings,
    validationError,
  }
}
