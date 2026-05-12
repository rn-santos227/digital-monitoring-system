import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type { CreateEngagementPayload, EngagementManagementListItem } from '~/types/domain/engagement'
import { showErrorDialog } from '~/utils/error-handling'

interface UseUpdateEngagementHandlerOptions {
  selectedEngagement: Ref<EngagementManagementListItem | null>
  isUpdateEngagementModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  updateEngagement: (id: string, payload: CreateEngagementPayload) => Promise<void>
  getEngagementById: (id: string) => Promise<EngagementManagementListItem>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

export const useUpdateEngagementHandler = ({
  selectedEngagement,
  isUpdateEngagementModalOpen,
  errorMessage,
  updateEngagement,
  getEngagementById,
  showDialog,
}: UseUpdateEngagementHandlerOptions) => {
  const onOpenUpdateEngagementModal = async (id: string) => {
    selectedEngagement.value = await getEngagementById(id)
    isUpdateEngagementModalOpen.value = true
  }

  const onCloseUpdateEngagementModal = () => {
    isUpdateEngagementModalOpen.value = false
  }

  const onSubmitUpdateEngagement = async (payload: CreateEngagementPayload) => {
    const id = selectedEngagement.value?.id ?? ''
    if (!id) {
      return
    }

    errorMessage.value = ''

    try {
      await updateEngagement(id, payload)
      onCloseUpdateEngagementModal()
      await showDialog({
        type: 'success',
        title: 'Engagement updated',
        message: 'Engagement profile has been updated successfully.',
        confirmLabel: 'OK',
      })
    } catch (error) {
      errorMessage.value = await showErrorDialog({
        showDialog,
        title: 'Engagement update failed',
        error,
        fallbackMessage: 'Unable to update engagement profile right now.',
      })
    }
  }

  return {
    onOpenUpdateEngagementModal,
    onCloseUpdateEngagementModal,
    onSubmitUpdateEngagement,
  }
}
