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

