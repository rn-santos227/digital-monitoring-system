import type { Ref } from 'vue'

type DeploymentActionRow = Record<string, unknown>

const resolveDeploymentActionRowId = (row: DeploymentActionRow): string => {
  return String(row.id ?? '')
}

interface UseViewDeploymentHandlerOptions {
  selectedDeployment: Ref<DeploymentActionRow | null>
  isViewDeploymentModalOpen: Ref<boolean>
  getDeploymentById?: (id: string) => Promise<DeploymentActionRow>
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
