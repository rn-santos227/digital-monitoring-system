import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { DeploymentManagementSearchQuery } from '~/types/domain/deployment'
import { useDeploymentsStore } from '~/stores/deployments'
import type { CreateDeploymentRecordPayload, UpdateDeploymentRecordPayload } from '~/types/domain/deployment'

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
    statusName: item.statusName ?? '—',
    remarks: item.remarks ?? '—',
  })))

  const loadDeploymentRecords = async (page = records.value.pagination.page, nextFilters: Partial<DeploymentManagementSearchQuery> = filters.value, pageSize = records.value.pagination.pageSize) => {
    filters.value = { ...nextFilters }
    try {
      await deploymentsStore.fetchDeploymentRecords(page, filters.value, pageSize)
    } catch {
      // Error state is exposed from the store.
    }
  }

  const createDeploymentRecord = async (payload: CreateDeploymentRecordPayload) => deploymentsStore.createDeploymentRecord(payload)
  const updateDeploymentRecord = async (id: string, payload: UpdateDeploymentRecordPayload) => deploymentsStore.updateDeploymentRecord(id, payload)
  const updateDeploymentRecordLocation = async (id: string, payload: UpdateDeploymentRecordPayload) => deploymentsStore.updateDeploymentRecordLocation(id, payload)
  const deleteDeploymentRecord = async (id: string) => deploymentsStore.deleteDeploymentRecord(id)
  const getDeploymentRecordById = async (id: string) => deploymentsStore.fetchDeploymentRecordById(id)

  return {
    filters,
    tableRows,
    pagination: computed(() => records.value.pagination),
    isLoading: computed(() => records.value.isLoading),
    error: computed(() => records.value.error),
    totalItems: computed(() => records.value.pagination.totalItems),
    loadDeploymentRecords,
    createDeploymentRecord,
    updateDeploymentRecord,
    updateDeploymentRecordLocation,
    deleteDeploymentRecord,
    getDeploymentRecordById,
  }
}
