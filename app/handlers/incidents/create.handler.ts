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


}
