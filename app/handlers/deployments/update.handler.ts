import { computed, type Ref } from 'vue'
import { DEPLOYMENTS_CREATE_STATUS_OPTIONS } from '~/constants/page.constants'
import type { DialogInput } from '~/composables/useDialog'
import type { 
  DeploymentManagementListItem,
  CreateDeploymentPayload,
  DeploymentRecordFormValues,
} from '~/types/domain/deployment'
import { showErrorDialog } from '~/utils/error-handling'

interface UseUpdateDeploymentHandlerOptions {
  isUpdateDeploymentModalOpen: Ref<boolean>
  selectedDeployment: Ref<DeploymentManagementListItem | null>
  getDeploymentById: (id: string) => Promise<DeploymentManagementListItem>
  updateDeploymentDetails: (id: string, payload: CreateDeploymentPayload) => Promise<void>
  updateDeploymentLocation: (id: string, payload: CreateDeploymentPayload) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  errorMessage: Ref<string>
  isUpdateDeploymentLocationModalOpen?: Ref<boolean>
}

interface UseUpdateDeploymentRecordHandlerOptions {
  isUpdateDeploymentRecordModalOpen: Ref<boolean>
  selectedDeploymentRecord: Ref<DeploymentManagementListItem | null>
  updateDeploymentRecord: (id: string, payload: import('~/types/domain/deployment').UpdateDeploymentRecordPayload) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  errorMessage: Ref<string>
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
    statusName: row.statusName ? String(row.statusName) : null,
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
    const normalizedStatusId = String(selectedDeployment.value?.statusId ?? '')
    const normalizedStatusName = String(selectedDeployment.value?.statusName ?? '')
    const normalizedStatusNameLower = normalizedStatusName.toLowerCase()

    const matchedStatusOption = DEPLOYMENTS_CREATE_STATUS_OPTIONS.find((option) => {
      const optionValue = String(option.value)
      return optionValue === normalizedStatusId
        || optionValue.toLowerCase() === normalizedStatusNameLower
    })

    const fallbackStatusValue = matchedStatusOption
      ? String(matchedStatusOption.value)
      : (normalizedStatusId || normalizedStatusName)

    return {
      deploymentArea: String(selectedDeployment.value?.deploymentArea ?? ''),
      assignmentRole: String(selectedDeployment.value?.assignmentRole ?? ''),
      deploymentAreaLatitude: String(selectedDeployment.value?.deploymentAreaLatitude ?? ''),
      deploymentAreaLongitude: String(selectedDeployment.value?.deploymentAreaLongitude ?? ''),
      operationName: String(selectedDeployment.value?.operationName ?? ''),
      startDate: String(selectedDeployment.value?.startDate ?? ''),
      endDate: String(selectedDeployment.value?.endDate ?? ''),
      statusId: fallbackStatusValue,
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

interface UseUpdateDeploymentRecordHandlerOptions {
  isUpdateDeploymentRecordModalOpen: Ref<boolean>
  selectedDeploymentRecord: Ref<DeploymentManagementListItem | null>
  updateDeploymentRecord: (id: string, payload: import('~/types/domain/deployment').UpdateDeploymentRecordPayload) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  errorMessage: Ref<string>
}

export const useUpdateDeploymentRecordHandler = ({
  isUpdateDeploymentRecordModalOpen,
  selectedDeploymentRecord,
  updateDeploymentRecord,
  showDialog,
  errorMessage,
}: UseUpdateDeploymentRecordHandlerOptions) => {
  const onCloseUpdateDeploymentRecordModal = () => {
    isUpdateDeploymentRecordModalOpen.value = false
    selectedDeploymentRecord.value = null
  }

  const selectedDeploymentRecordFormValues = computed<DeploymentRecordFormValues>(() => ({
    personnelName: selectedDeploymentRecord.value?.personnelName ?? '',
    operationName: selectedDeploymentRecord.value?.operationName ?? '',
    assignmentRole: selectedDeploymentRecord.value?.assignmentRole ?? '',
    deploymentArea: selectedDeploymentRecord.value?.deploymentArea ?? '',
    deploymentAreaLatitude: String(selectedDeploymentRecord.value?.deploymentAreaLatitude ?? ''),
    deploymentAreaLongitude: String(selectedDeploymentRecord.value?.deploymentAreaLongitude ?? ''),
    startDate: selectedDeploymentRecord.value?.startDate ?? '',
    endDate: selectedDeploymentRecord.value?.endDate ?? '',
    location: selectedDeploymentRecord.value?.location ?? '',
    remarks: selectedDeploymentRecord.value?.remarks ?? '',
  }))

  const onSubmitUpdateDeploymentRecord = async (payload: import('~/types/domain/deployment').UpdateDeploymentRecordPayload) => {
    errorMessage.value = ''
    const id = selectedDeploymentRecord.value?.id
    if (!id) {
      return
    }

    try {
      await updateDeploymentRecord(String(id), payload)
      onCloseUpdateDeploymentRecordModal()
    } catch (error) {
      errorMessage.value = await showErrorDialog({
        showDialog,
        title: 'Deployment record update failed',
        error,
        fallbackMessage: 'Unable to update deployment record right now.',
      })
    }
  }

  return {
    onCloseUpdateDeploymentRecordModal,
    selectedDeploymentRecordFormValues,
    onSubmitUpdateDeploymentRecord,
  }
}
