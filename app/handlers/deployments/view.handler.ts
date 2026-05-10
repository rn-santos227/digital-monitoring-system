import type { Ref } from 'vue'
import type { DeploymentManagementListItem } from '~/types/domain/deployment'

type DeploymentActionRow = DeploymentManagementListItem

const resolveDeploymentActionRowId = (row: DeploymentActionRow): string => {
  return row.id
}

interface UseViewDeploymentHandlerOptions {
  selectedDeployment: Ref<DeploymentActionRow | null>
  isViewDeploymentModalOpen: Ref<boolean>
  getDeploymentById?: (id: string) => Promise<DeploymentActionRow>
}

interface UseViewDeploymentRecordHandlerOptions {
  selectedDeploymentRecord: Ref<DeploymentActionRow | null>
  isViewDeploymentRecordModalOpen: Ref<boolean>
  getDeploymentRecordById: (id: string) => Promise<DeploymentActionRow>
}

export const useViewDeploymentHandler = ({
  selectedDeployment,
  isViewDeploymentModalOpen,
  getDeploymentById,
}: UseViewDeploymentHandlerOptions) => {
  const onCloseViewDeploymentModal = () => {
    isViewDeploymentModalOpen.value = false
    selectedDeployment.value = null
  }

  const onViewDeploymentAction = async (row: DeploymentActionRow): Promise<boolean> => {
    const deploymentId = resolveDeploymentActionRowId(row)
    if (!deploymentId) {
      return true
    }

    selectedDeployment.value = getDeploymentById
      ? await getDeploymentById(deploymentId)
      : row
    isViewDeploymentModalOpen.value = true
    return true
  }

  return {
    onCloseViewDeploymentModal,
    onViewDeploymentAction,
  }
}

export const useViewDeploymentRecordHandler = ({
  selectedDeploymentRecord,
  isViewDeploymentRecordModalOpen,
  getDeploymentRecordById,
}: UseViewDeploymentRecordHandlerOptions) => {
  const onCloseViewDeploymentRecordModal = () => {
    isViewDeploymentRecordModalOpen.value = false
    selectedDeploymentRecord.value = null
  }

  const onViewDeploymentRecordAction = async (row: Record<string, unknown>) => {
    const deploymentRecordId = String(row.id ?? '')

    if (!deploymentRecordId) {
      return
    }

    selectedDeploymentRecord.value = await getDeploymentRecordById(deploymentRecordId)
    isViewDeploymentRecordModalOpen.value = true
  }

  return {
    onCloseViewDeploymentRecordModal,
    onViewDeploymentRecordAction,
  }
}
