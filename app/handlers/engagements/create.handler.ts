import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type { CreateEngagementPayload, CreateEngagementRecordPayload } from '~/types/domain/engagement'
import { showErrorDialog } from '~/utils/error-handling'

interface UseCreateEngagementHandlerOptions {
  isCreateEngagementModalOpen: Ref<boolean>
  createEngagement: (payload: CreateEngagementPayload) => Promise<{ id: string }>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  errorMessage: Ref<string>
}

interface UseCreateEngagementRecordHandlerOptions {
  isCreateEngagementRecordModalOpen: Ref<boolean>
  createEngagementRecord: (payload: CreateEngagementRecordPayload) => Promise<{ id: string }>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  errorMessage: Ref<string>
}

export const useCreateEngagementHandler = ({
  isCreateEngagementModalOpen,
  createEngagement,
  showDialog,
  errorMessage,
}: UseCreateEngagementHandlerOptions) => {
  const onOpenCreateEngagementModal = () => {
    isCreateEngagementModalOpen.value = true
  }

  const onCloseCreateEngagementModal = () => {
    isCreateEngagementModalOpen.value = false
  }

  const onSubmitCreateEngagement = async (payload: CreateEngagementPayload) => {
    errorMessage.value = ''

    try {
      await createEngagement(payload)
      onCloseCreateEngagementModal()
      await showDialog({
        type: 'success',
        title: 'Engagement created',
        message: 'Engagement profile has been created successfully.',
        confirmLabel: 'OK',
      })
    } catch (error) {
      errorMessage.value = await showErrorDialog({
        showDialog,
        title: 'Engagement creation failed',
        error,
        fallbackMessage: 'Unable to create engagement profile right now.',
      })
    }
  }

  return {
    onOpenCreateEngagementModal,
    onCloseCreateEngagementModal,
    onSubmitCreateEngagement,
  }
}

export const useCreateEngagementRecordHandler = ({
  isCreateEngagementRecordModalOpen,
  createEngagementRecord,
  showDialog,
  errorMessage,
}: UseCreateEngagementRecordHandlerOptions) => {
  const onCloseCreateEngagementRecordModal = () => {
    isCreateEngagementRecordModalOpen.value = false
  }

  const onSubmitCreateEngagementRecord = async (payload: CreateEngagementRecordPayload) => {
    errorMessage.value = ''
    try {
      await createEngagementRecord(payload)
      onCloseCreateEngagementRecordModal()
      await showDialog({
        type: 'success',
        title: 'Engagement record created',
        message: 'Personnel engagement record has been created successfully.',
        confirmLabel: 'OK',
      })
    } catch (error) {
      errorMessage.value = await showErrorDialog({
        showDialog,
        title: 'Engagement record creation failed',
        error,
        fallbackMessage: 'Unable to create personnel engagement record right now.',
      })
    }
  }

  return {
    onCloseCreateEngagementRecordModal,
    onSubmitCreateEngagementRecord,
  }
}
