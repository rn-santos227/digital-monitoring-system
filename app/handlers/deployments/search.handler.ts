import type { Ref } from 'vue'
import type { DeploymentManagementSearchQuery } from '~/types/domain/deployment'

export const useDeploymentSearchHandlers = (deploymentFilters: Ref<Partial<DeploymentManagementSearchQuery>>) => {
  const handleDeploymentFilterApply = (value: Partial<DeploymentManagementSearchQuery>) => {

    deploymentFilters.value = filters
    return { filters, errors, isValid: Object.keys(errors).length === 0 }
  }

  const handleDeploymentFilterReset = () => {
    const filters: Partial<DeploymentManagementSearchQuery> = {}
    deploymentFilters.value = filters
    return filters
  }

  return { handleDeploymentFilterApply, handleDeploymentFilterReset }
}
