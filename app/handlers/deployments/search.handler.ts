import type { Ref } from 'vue'
import type { DeploymentManagementSearchQuery } from '~/types/domain/deployment'

export const useDeploymentSearchHandlers = (deploymentFilters: Ref<Partial<DeploymentManagementSearchQuery>>) => {
  const handleDeploymentFilterApply = (value: Partial<DeploymentManagementSearchQuery>) => {
    const filters: Partial<DeploymentManagementSearchQuery> = {
      conditions: value.conditions?.trim() || undefined,
      match: value.match ?? 'all',
    }

    deploymentFilters.value = filters
    return { filters, errors: {}, isValid: true }
  }

  const handleDeploymentFilterReset = () => {
    const filters: Partial<DeploymentManagementSearchQuery> = {}
    deploymentFilters.value = filters
    return filters
  }

  return { handleDeploymentFilterApply, handleDeploymentFilterReset }
}
