import { computed, type Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type { DeploymentManagementListItem } from '~/types/domain/deployment'
import type { CreateDeploymentPayload } from '~/types/domain/deployment'
import { showErrorDialog } from '~/utils/error-handling'

interface UseUpdateDeploymentHandlerOptions {
  isUpdateDeploymentModalOpen: Ref<boolean>
  selectedDeployment: Ref<DeploymentManagementListItem | null>
  getDeploymentById: (id: string) => Promise<Record<string, unknown>>
  updateDeploymentDetails: (id: string, payload: CreateDeploymentPayload) => Promise<void>
  updateDeploymentLocation: (id: string, payload: CreateDeploymentPayload) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  errorMessage: Ref<string>
  isUpdateDeploymentLocationModalOpen?: Ref<boolean>
}

export const useUpdateDeploymentHandler = ({
  isUpdateDeploymentModalOpen,
  selectedDeployment,
  getDeploymentById,
  updateDeploymentDetails,
  updateDeploymentLocation,
  showDialog,
  errorMessage,
  isUpdateDeploymentLocationModalOpen,
}: UseUpdateDeploymentHandlerOptions) => {
  const normalizeDeploymentRow = (
    row: Partial<DeploymentManagementListItem>,
  ): DeploymentManagementListItem => ({
    id: String(row.id ?? ''),
    operationName: String(row.operationName ?? ''),
    deploymentArea: String(row.deploymentArea ?? ''),
    deploymentAreaLatitude:
      typeof row.deploymentAreaLatitude === 'number' ? row.deploymentAreaLatitude : null,
    deploymentAreaLongitude:
      typeof row.deploymentAreaLongitude === 'number' ? row.deploymentAreaLongitude : null,
    assignmentRole: row.assignmentRole ? String(row.assignmentRole) : null,
    startDate: row.startDate ? String(row.startDate) : null,
    endDate: row.endDate ? String(row.endDate) : null,
    status: row.status ? String(row.status) : null,
    statusId: row.statusId ? String(row.statusId) : null,
    location: row.location ? String(row.location) : null,
    supervisorId: row.supervisorId ? String(row.supervisorId) : null,
    defaultRemarks: row.defaultRemarks ? String(row.defaultRemarks) : null,
  })

  const onOpenUpdateDeploymentModal = async (
    row: Partial<DeploymentManagementListItem>,
  ) => {
    const normalizedRow = normalizeDeploymentRow(row)
    const deploymentId = normalizedRow.id

    selectedDeployment.value = normalizedRow

    if (deploymentId.length > 0) {
      const fetchedDeployment = await getDeploymentById(deploymentId)
      selectedDeployment.value = normalizeDeploymentRow(fetchedDeployment)
    }

    isUpdateDeploymentModalOpen.value = true
  }

  const onCloseUpdateDeploymentModal = () => {
    isUpdateDeploymentModalOpen.value = false
    selectedDeployment.value = null

    if (isUpdateDeploymentLocationModalOpen) {
      isUpdateDeploymentLocationModalOpen.value = false
    }
  }

  const selectedDeploymentFormValues = computed(() => {
    const fallbackStatusValue = typeof selectedDeployment.value?.status === 'string'
      ? selectedDeployment.value.status
      : ''

    return {
      deploymentArea: String(selectedDeployment.value?.deploymentArea ?? ''),
      assignmentRole: String(selectedDeployment.value?.assignmentRole ?? ''),
      deploymentAreaLatitude: String(selectedDeployment.value?.deploymentAreaLatitude ?? ''),
      deploymentAreaLongitude: String(selectedDeployment.value?.deploymentAreaLongitude ?? ''),
      operationName: String(selectedDeployment.value?.operationName ?? ''),
      startDate: String(selectedDeployment.value?.startDate ?? ''),
      endDate: String(selectedDeployment.value?.endDate ?? ''),
      statusId: String(selectedDeployment.value?.statusId ?? fallbackStatusValue),
      location: String(selectedDeployment.value?.location ?? ''),
      supervisorId: String(selectedDeployment.value?.supervisorId ?? ''),
      defaultRemarks: String(selectedDeployment.value?.defaultRemarks ?? ''),
    }
  })

  const submitWithAction = async (
    payload: CreateDeploymentPayload,
    action: (id: string, payload: CreateDeploymentPayload) => Promise<void>,
  ) => {
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

  const onSubmitUpdateDeploymentDetails = async (payload: CreateDeploymentPayload) => {
    await submitWithAction(payload, updateDeploymentDetails)
  }

  const onSubmitUpdateDeploymentLocation = async (payload: CreateDeploymentPayload) => {
    await submitWithAction(payload, updateDeploymentLocation)
  }

  return {
    onOpenUpdateDeploymentModal,
    onCloseUpdateDeploymentModal,
    selectedDeploymentFormValues,
    onSubmitUpdateDeploymentDetails,
    onSubmitUpdateDeploymentLocation,
  }
}
