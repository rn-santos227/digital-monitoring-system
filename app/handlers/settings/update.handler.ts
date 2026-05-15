import type { Ref } from 'vue'
import { ref } from 'vue'
import { useDialog } from '~/composables/useDialog'
import type { UpdateApplicationSettingsPayload } from '~/types/domain/application-settings'
import { showErrorDialog } from '~/utils/error-handling'
import { validateApplicationSettingsUpdate } from '~/utils/application-settings-validation'

interface UseUpdateSettingsHandlerOptions {
  canUpdate: Ref<boolean>
  updateApplicationSettings: (payload: UpdateApplicationSettingsPayload) => Promise<void>
}

export const useUpdateSettingsHandler = ({
  canUpdate,
  updateApplicationSettings,
}: UseUpdateSettingsHandlerOptions) => {
  const { showDialog } = useDialog()
  const validationError = ref('')
  const errorMessage = ref('')
  const infoMessage = ref('')
  const dangerMessage = ref('')

  const onUpdateSettings = async (payload: UpdateApplicationSettingsPayload) => {
    validationError.value = ''
    errorMessage.value = ''
    infoMessage.value = ''
    dangerMessage.value = ''

    if (!canUpdate.value) {
      errorMessage.value = 'Update privilege is required to save application settings.'
      return
    }

    const updateValidationError = validateApplicationSettingsUpdate(payload)
    if (updateValidationError) {
      validationError.value = updateValidationError
      dangerMessage.value = updateValidationError
      return
    }

    try {
      await updateApplicationSettings(payload)
      infoMessage.value = 'Application settings have been updated successfully.'
      await showDialog({
        type: 'success',
        title: 'Settings saved',
        message: 'Application settings were saved successfully.',
        confirmLabel: 'OK',
      })
    } catch (error: unknown) {
      errorMessage.value = await showErrorDialog({
        showDialog,
        title: 'Unable to save settings',
        error,
        fallbackMessage: 'Unable to save application settings right now.',
      })
    }
  }

  return {
    dangerMessage,
    errorMessage,
    infoMessage,
    onUpdateSettings,
    validationError,
  }
}
