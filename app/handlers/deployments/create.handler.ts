import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type { CreateDeploymentPayload } from '~/types/domain/deployment'
import { showErrorDialog } from '~/utils/error-handling'

interface UseCreateDeploymentHandlerOptions {
  isCreateDeploymentModalOpen: Ref<boolean>
  createDeployment: (payload: CreateDeploymentPayload) => Promise<{ id: string }>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  errorMessage: Ref<string>
}

export const useCreateDeploymentHandler = ({
  isCreateDeploymentModalOpen,
  createDeployment,
  showDialog,
  errorMessage,
}: UseCreateDeploymentHandlerOptions) => {
  const onOpenCreateDeploymentModal = () => {
    isCreateDeploymentModalOpen.value = true
  }

  const onCloseCreateDeploymentModal = () => {
    isCreateDeploymentModalOpen.value = false
  }

  const onSubmitCreateDeployment = async (payload: CreateDeploymentPayload) => {
    errorMessage.value = ''
    try {
      await createDeployment(payload)
      onCloseCreateDeploymentModal()
      await showDialog({
        type: 'success',
        title: 'Deployment created',
        message: 'Deployment record has been created successfully.',
        confirmLabel: 'OK',
      })
    } catch (error) {
      errorMessage.value = await showErrorDialog({
        showDialog,
        title: 'Deployment creation failed',
        error,
        fallbackMessage: 'Unable to create deployment record right now.',
      })
    }
  }

  return {
    onOpenCreateDeploymentModal,
    onCloseCreateDeploymentModal,
    onSubmitCreateDeployment,
  }
}
