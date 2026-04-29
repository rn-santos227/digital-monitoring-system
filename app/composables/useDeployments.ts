import { computed, ref } from 'vue'
import type { CreateDeploymentPayload, DeploymentManagementSearchQuery } from '~/types/domain/deployment'
import { useDeploymentsStore } from '~/stores/deployments'

export const useDeployments = () => {
  const store = useDeploymentsStore()
  const filters = ref<Partial<DeploymentManagementSearchQuery>>({})

  const tableRows = computed(() => store.deployments.items.map(item => ({
    id: item.id,
    operationName: item.operationName,
    deploymentArea: item.deploymentArea,
    deploymentAreaLatitude: item.deploymentAreaLatitude,
    deploymentAreaLongitude: item.deploymentAreaLongitude,
    startDate: item.startDate ?? '—',
    endDate: item.endDate ?? '—',
    status: item.status ?? '—',
  })))

  const loadDeployments = async (page = store.deployments.pagination.page, nextFilters: Partial<DeploymentManagementSearchQuery> = filters.value, pageSize = store.deployments.pagination.pageSize) => {
    filters.value = { ...nextFilters }
    await store.fetchDeployments(page, filters.value, pageSize)
  }

  const createDeployment = async (payload: CreateDeploymentPayload) => {
    await store.createDeployment(payload)
  }

  return { filters, tableRows, pagination: computed(() => store.deployments.pagination), isLoading: computed(() => store.deployments.isLoading), error: computed(() => store.deployments.error), loadDeployments, createDeployment }
}
