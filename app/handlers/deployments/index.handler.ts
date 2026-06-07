import type { Ref } from 'vue'
import { useDeploymentSearchHandlers } from './search.handler'
import type {
  DeploymentManagementListItem,
  DeploymentManagementSearchQuery,
  DeploymentManagementTabId,
} from '~/types/domain/deployment'

const DEPLOYMENT_MANAGEMENT_TAB_IDS: readonly DeploymentManagementTabId[] = ['records', 'deployments']

export const useDeploymentManagementPageHandlers = (
  activeTab: Ref<DeploymentManagementTabId>,
  deploymentFilters: Ref<Partial<DeploymentManagementSearchQuery>>,
  deploymentRecordFilters: Ref<Partial<DeploymentManagementSearchQuery>>,
) => {
  const handleTabChange = (nextTab: string) => {
    if (DEPLOYMENT_MANAGEMENT_TAB_IDS.includes(nextTab as DeploymentManagementTabId)) {
      activeTab.value = nextTab as DeploymentManagementTabId
    }
  }

  const { handleDeploymentFilterApply, handleDeploymentFilterReset } = useDeploymentSearchHandlers(deploymentFilters)
  const {
    handleDeploymentFilterApply: handleDeploymentRecordFilterApply,
    handleDeploymentFilterReset: handleDeploymentRecordFilterReset,
  } = useDeploymentSearchHandlers(deploymentRecordFilters)

  return {
    handleTabChange,
    handleDeploymentFilterApply,
    handleDeploymentFilterReset,
    handleDeploymentRecordFilterApply,
    handleDeploymentRecordFilterReset,
  }
}

interface UseDeploymentTableActionHandlersOptions {
  selectedDeployment: Ref<DeploymentManagementListItem | null>
  selectedDeploymentRecord: Ref<DeploymentManagementListItem | null>
  isUpdateDeploymentDetailModalOpen: Ref<boolean>
  isUpdateDeploymentLocationModalOpen: Ref<boolean>
  isViewDeploymentModalOpen: Ref<boolean>
  isUpdateDeploymentRecordModalOpen: Ref<boolean>
  isUpdateDeploymentRecordLocationModalOpen: Ref<boolean>
  getDeploymentById: (id: string) => Promise<DeploymentManagementListItem>
  getDeploymentRecordById: (id: string) => Promise<DeploymentManagementListItem>
  onViewDeploymentAction: (row: Partial<DeploymentManagementListItem>) => Promise<unknown>
  onViewDeploymentRecordAction: (row: Record<string, unknown>) => Promise<unknown>
  onOpenUpdateDeploymentModal: (
    row: Partial<DeploymentManagementListItem>,
  ) => Promise<unknown>
  onDeleteDeployment: (row: Record<string, unknown>) => Promise<unknown>
}

export const useDeploymentTableActionHandlers = ({
  selectedDeployment,
  selectedDeploymentRecord,
  isUpdateDeploymentDetailModalOpen,
  isUpdateDeploymentLocationModalOpen,
  isViewDeploymentModalOpen,
  isUpdateDeploymentRecordModalOpen,
  isUpdateDeploymentRecordLocationModalOpen,
  getDeploymentById,
  getDeploymentRecordById,
  onViewDeploymentAction,
  onViewDeploymentRecordAction,
  onOpenUpdateDeploymentModal,
  onDeleteDeployment,
}: UseDeploymentTableActionHandlersOptions) => {

}
