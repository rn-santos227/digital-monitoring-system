import { computed, type Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type { CreateDeploymentPayload } from '~/types/domain/deployment'
import { showErrorDialog } from '~/utils/error-handling'

export const useUpdateDeploymentHandler = (
  isUpdateDeploymentModalOpen: Ref<boolean>,
  selectedDeployment: Ref<Record<string, unknown> | null>,
  updateDeploymentDetails: (id: string, payload: CreateDeploymentPayload) => Promise<void>,
  updateDeploymentLocation: (id: string, payload: CreateDeploymentPayload) => Promise<void>,
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>,
  errorMessage: Ref<string>,
  isUpdateDeploymentLocationModalOpen?: Ref<boolean>,
) => {
  const onOpenUpdateDeploymentModal = (row: Record<string, unknown>) => {
    selectedDeployment.value = row
    isUpdateDeploymentModalOpen.value = true
  }

  const onCloseUpdateDeploymentModal = () => {
    isUpdateDeploymentModalOpen.value = false
    selectedDeployment.value = null
    if (isUpdateDeploymentLocationModalOpen) {
      isUpdateDeploymentLocationModalOpen.value = false
    }
  }

  const selectedDeploymentFormValues = computed(() => ({
    deploymentArea: String(selectedDeployment.value?.deploymentArea ?? ''),
    assignmentRole: String(selectedDeployment.value?.assignmentRole ?? ''),
    deploymentAreaLatitude: String(selectedDeployment.value?.deploymentAreaLatitude ?? ''),
    deploymentAreaLongitude: String(selectedDeployment.value?.deploymentAreaLongitude ?? ''),
    operationName: String(selectedDeployment.value?.operationName ?? ''),
    startDate: String(selectedDeployment.value?.startDate ?? ''),
    endDate: String(selectedDeployment.value?.endDate ?? ''),
    statusId: String(selectedDeployment.value?.statusId ?? ''),
    location: String(selectedDeployment.value?.location ?? ''),
    supervisorId: String(selectedDeployment.value?.supervisorId ?? ''),
    defaultRemarks: String(selectedDeployment.value?.defaultRemarks ?? ''),
  }))

  const submitWithAction = async (payload: CreateDeploymentPayload, action: (id: string, payload: CreateDeploymentPayload) => Promise<void>) => {
    errorMessage.value = ''
    const deploymentId = selectedDeployment.value?.id
    if (!deploymentId || typeof deploymentId !== 'string') {
      return
    }

    try {
      await action(deploymentId, payload)
      onCloseUpdateDeploymentModal()
    } catch (error) {
      errorMessage.value = await showErrorDialog({
        showDialog,
        title: 'Deployment update failed',
        error,
        fallbackMessage: 'Unable to update deployment record right now.',
      })
    }
  }

  const onSubmitUpdateDeploymentDetails = async (payload: CreateDeploymentPayload) => submitWithAction(payload, updateDeploymentDetails)
  const onSubmitUpdateDeploymentLocation = async (payload: CreateDeploymentPayload) => submitWithAction(payload, updateDeploymentLocation)

  return { onOpenUpdateDeploymentModal, onCloseUpdateDeploymentModal, selectedDeploymentFormValues, onSubmitUpdateDeploymentDetails, onSubmitUpdateDeploymentLocation }
}
