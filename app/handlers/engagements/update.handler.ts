import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type { CreateEngagementPayload, CreateEngagementRecordPayload, EngagementManagementListItem } from '~/types/domain/engagement'
import { showErrorDialog } from '~/utils/error-handling'

interface UseUpdateEngagementHandlerOptions {
  selectedEngagement: Ref<EngagementManagementListItem | null>
  isUpdateEngagementModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  updateEngagement: (id: string, payload: CreateEngagementPayload) => Promise<void>
  getEngagementById: (id: string) => Promise<EngagementManagementListItem>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

interface UseUpdateEngagementRecordHandlerOptions {
  selectedEngagementRecord: Ref<EngagementManagementListItem | null>
  isUpdateEngagementRecordModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  getEngagementRecordById: (id: string) => Promise<EngagementManagementListItem>
  updateEngagementRecord: (id: string, payload: CreateEngagementRecordPayload) => Promise<void>
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

export const useUpdateEngagementRecordHandler = ({
  selectedEngagementRecord,
  isUpdateEngagementRecordModalOpen,
  errorMessage,
  getEngagementRecordById,
  updateEngagementRecord,
  showDialog,
}: UseUpdateEngagementRecordHandlerOptions) => {
  const onOpenUpdateEngagementRecordModal = async (id: string) => {
    selectedEngagementRecord.value = await getEngagementRecordById(id)
    isUpdateEngagementRecordModalOpen.value = true
  }

  const onCloseUpdateEngagementRecordModal = () => {
    isUpdateEngagementRecordModalOpen.value = false
  }

  const onSubmitUpdateEngagementRecord = async (payload: CreateEngagementRecordPayload) => {
    const id = selectedEngagementRecord.value?.id ?? ''

    if (!id) {
      return
    }

    errorMessage.value = ''

    try {
      await updateEngagementRecord(id, payload)
      onCloseUpdateEngagementRecordModal()
      await showDialog({
        type: 'success',
        title: 'Engagement record updated',
        message: 'Personnel engagement record has been updated successfully.',
        confirmLabel: 'OK',
      })
    } catch (error) {
      errorMessage.value = await showErrorDialog({
        showDialog,
        title: 'Engagement record update failed',
        error,
        fallbackMessage: 'Unable to update personnel engagement record right now.',
      })
    }
  }

  return {
    onOpenUpdateEngagementRecordModal,
    onCloseUpdateEngagementRecordModal,
    onSubmitUpdateEngagementRecord,
  }
}
