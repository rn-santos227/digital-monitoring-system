import type { Ref } from 'vue'
import type { DeploymentManagementListItem } from '~/types/domain/deployment'

type DeploymentActionRow = DeploymentManagementListItem

const normalizeDeploymentActionRow = (
  row: Partial<DeploymentActionRow>,
): DeploymentActionRow => ({
  id: String(row.id ?? ''),
  operationName: String(row.operationName ?? ''),
  deploymentArea: String(row.deploymentArea ?? ''),
  deploymentAreaLatitude:
    typeof row.deploymentAreaLatitude === 'number' ? row.deploymentAreaLatitude : null,
  deploymentAreaLongitude:
    typeof row.deploymentAreaLongitude === 'number' ? row.deploymentAreaLongitude : null,
  assignmentRole: row.assignmentRole ?? null,
  startDate: row.startDate ?? null,
  endDate: row.endDate ?? null,
  statusName: row.statusName ?? null,
  statusId: row.statusId ?? null,
  location: row.location ?? null,
  supervisorId: row.supervisorId ?? null,
  defaultRemarks: row.defaultRemarks ?? null,
})

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

  const onViewDeploymentAction = async (
    row: Partial<DeploymentActionRow>,
  ): Promise<boolean> => {
    const normalizedRow = normalizeDeploymentActionRow(row)
    const deploymentId = normalizedRow.id

    if (!deploymentId) {
      return true
    }

    selectedDeployment.value = getDeploymentById
      ? await getDeploymentById(deploymentId)
      : normalizedRow
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
