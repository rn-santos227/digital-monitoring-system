import type { Ref } from 'vue'
import { showErrorDialog } from '~/utils/error-handling'
import type { UpdatePersonnelPayload, PersonnelDetail } from '~/types/domain/personnel'
import type { DialogInput } from '~/composables/useDialog'
import type { Toast } from '~/composables/useToast'

type PersonnelToastInput = Omit<Toast, 'id'>

interface UseUpdatePersonnelHandlerOptions {
  selectedPersonnel: Ref<PersonnelDetail | null>
  isUpdatePersonnelModalOpen: Ref<boolean>
  getPersonnelById: (personnelId: string) => Promise<PersonnelDetail>
  updatePersonnel: (personnelId: string, payload: UpdatePersonnelPayload) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  addToast: (toast: PersonnelToastInput) => void
}

export const useUpdatePersonnelHandler = ({
  selectedPersonnel,
  isUpdatePersonnelModalOpen,
  getPersonnelById,
  updatePersonnel,
  showDialog,
  addToast,
}: UseUpdatePersonnelHandlerOptions) => {
  const closeUpdatePersonnelModal = () => {
    isUpdatePersonnelModalOpen.value = false
    selectedPersonnel.value = null
  }

  const onEditPersonnelAction = async (personnelId: string) => {
    try {
      selectedPersonnel.value = await getPersonnelById(personnelId)
      isUpdatePersonnelModalOpen.value = Boolean(selectedPersonnel.value)
    } catch {
      addToast({
        title: 'Personnel load failed',
        message: 'Unable to load personnel details for editing.',
        variant: 'error',
      })
    }
  }

  const onUpdatePersonnel = async (payload: UpdatePersonnelPayload) => {
    const selectedPersonnelId = selectedPersonnel.value?.id

    if (!selectedPersonnelId) {
      return
    }

    try {
      await updatePersonnel(selectedPersonnelId, payload)
      closeUpdatePersonnelModal()
      await showDialog({
        type: 'success',
        title: 'Personnel updated',
        message: 'Personnel record has been updated successfully.',
        confirmLabel: 'OK',
      })
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Personnel update failed',
        error,
        fallbackMessage: 'Unable to update personnel record right now.',
      })
    }
  }

  return {
    closeUpdatePersonnelModal,
    onEditPersonnelAction,
    onUpdatePersonnel,
  }
}
