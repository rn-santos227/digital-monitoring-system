import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { DeploymentManagementSearchQuery } from '~/types/domain/deployment'
import { useDeploymentsStore } from '~/stores/deployments'

export const useDeploymentRecords = () => {
  const deploymentsStore = useDeploymentsStore()
  const { records } = storeToRefs(deploymentsStore)
  const filters = ref<Partial<DeploymentManagementSearchQuery>>({})

  const tableRows = computed(() => records.value.items.map(item => ({
    id: item.id,
    operationName: item.operationName,
    deploymentArea: item.deploymentArea,
    startDate: item.startDate ?? '—',
    endDate: item.endDate ?? '—',
    status: item.status ?? '—',
  })))

  const loadDeploymentRecords = async (page = records.value.pagination.page, nextFilters: Partial<DeploymentManagementSearchQuery> = filters.value, pageSize = records.value.pagination.pageSize) => {
    filters.value = { ...nextFilters }
    try {
      await deploymentsStore.fetchDeploymentRecords(page, filters.value, pageSize)
    } catch {
      // Error state is exposed from the store.
    }
  }

  return {
    filters,
    tableRows,
    pagination: computed(() => records.value.pagination),
    isLoading: computed(() => records.value.isLoading),
    error: computed(() => records.value.error),
    totalItems: computed(() => records.value.pagination.totalItems),
    loadDeploymentRecords,
  }
}
