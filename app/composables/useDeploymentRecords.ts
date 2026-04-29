import { computed, ref } from 'vue'
import type { DeploymentManagementSearchQuery } from '~/types/domain/deployment'
import { useDeploymentsStore } from '~/stores/deployments'

export const useDeploymentRecords = () => {
  const store = useDeploymentsStore()
  const filters = ref<Partial<DeploymentManagementSearchQuery>>({})

  const tableRows = computed(() => store.records.items.map(item => ({
    id: item.id,
    operationName: item.operationName,
    deploymentArea: item.deploymentArea,
    startDate: item.startDate ?? '—',
    endDate: item.endDate ?? '—',
    status: item.status ?? '—',
  })))

  const loadDeploymentRecords = async (page = store.records.pagination.page, nextFilters: Partial<DeploymentManagementSearchQuery> = filters.value, pageSize = store.records.pagination.pageSize) => {
    filters.value = { ...nextFilters }
    await store.fetchDeploymentRecords(page, filters.value, pageSize)
  }

  return { filters, tableRows, pagination: computed(() => store.records.pagination), isLoading: computed(() => store.records.isLoading), error: computed(() => store.records.error), loadDeploymentRecords }
}
