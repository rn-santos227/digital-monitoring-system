import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type { CreateEquipmentIncidentPayload } from '~/types/domain/incident'
import { showErrorDialog } from '~/utils/error-handling'

interface UseCreateEquipmentIncidentHandlerOptions {
  isCreateEquipmentIncidentModalOpen: Ref<boolean>
  createEquipmentIncident: (payload: CreateEquipmentIncidentPayload) => Promise<{ id: string }>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  errorMessage: Ref<string>
}

export const useCreateEquipmentIncidentHandler = ({
  isCreateEquipmentIncidentModalOpen,
  createEquipmentIncident,
  showDialog,
  errorMessage,
}: UseCreateEquipmentIncidentHandlerOptions) => {
  const onOpenCreateEquipmentIncidentModal = () => {
    errorMessage.value = ''
    isCreateEquipmentIncidentModalOpen.value = true
  }

  const onCloseCreateEquipmentIncidentModal = () => {
    isCreateEquipmentIncidentModalOpen.value = false
  }

  const onSubmitCreateEquipmentIncident = async (payload: CreateEquipmentIncidentPayload) => {
    errorMessage.value = ''

    try {
      await createEquipmentIncident(payload)
      onCloseCreateEquipmentIncidentModal()
      await showDialog({
        type: 'success',
        title: 'Equipment incident created',
        message: 'Equipment incident has been created and added to incident tracking.',
        confirmLabel: 'OK',
      })
    } catch (error) {
      errorMessage.value = await showErrorDialog({
        showDialog,
        title: 'Equipment incident creation failed',
        error,
        fallbackMessage: 'Unable to create equipment incident right now.',
      })
    }
  }

  return {
    onOpenCreateEquipmentIncidentModal,
    onCloseCreateEquipmentIncidentModal,
    onSubmitCreateEquipmentIncident,
  }
}
