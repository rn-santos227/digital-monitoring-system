import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { CreateDeploymentPayload, DeploymentManagementListItem, DeploymentManagementSearchQuery } from '~/types/domain/deployment'
import { useDeploymentsStore } from '~/stores/deployments'

export const useDeployments = () => {
  const deploymentsStore = useDeploymentsStore()
  const { deployments } = storeToRefs(deploymentsStore)
  const filters = ref<Partial<DeploymentManagementSearchQuery>>({})

  const normalizeDisplayValue = (value: unknown): string => {
    if (typeof value === 'string') {
      return value.trim().length > 0 ? value : '—'
    }

    return '—'
  }

  const resolveDeploymentStatus = (item: DeploymentManagementListItem & { statusName?: string | null }): string =>
    normalizeDisplayValue(item.statusName)

  const tableRows = computed(() => deployments.value.items.map(item => ({
    id: item.id,
    operationName: normalizeDisplayValue(item.operationName),
    deploymentArea: normalizeDisplayValue(item.deploymentArea),
    assignmentRole: item.assignmentRole ?? '',
    deploymentAreaLatitude: item.deploymentAreaLatitude ?? '',
    deploymentAreaLongitude: item.deploymentAreaLongitude ?? '',
    startDate: item.startDate ?? '',
    endDate: item.endDate ?? '—',
    statusName: resolveDeploymentStatus(item as DeploymentManagementListItem & { statusName?: string | null }),
    statusId: item.statusId ?? '',
    location: item.location ?? '',
    supervisorId: item.supervisorId ?? '',
    defaultRemarks: item.defaultRemarks ?? '',
  })))

  const loadDeployments = async (page = deployments.value.pagination.page, nextFilters: Partial<DeploymentManagementSearchQuery> = filters.value, pageSize = deployments.value.pagination.pageSize) => {
    filters.value = { ...nextFilters }
    try {
      await deploymentsStore.fetchDeployments(page, filters.value, pageSize)
    } catch {
      // Error state is exposed from the store.
    }
  }

  const createDeployment: (payload: CreateDeploymentPayload) => Promise<{ id: string }> = (payload) => {
    return deploymentsStore.createDeployment(payload)
  }

  const updateDeploymentDetails = async (id: string, payload: CreateDeploymentPayload) => {
    await deploymentsStore.updateDeploymentDetails(id, payload)
  }

  const updateDeploymentLocation = async (id: string, payload: CreateDeploymentPayload) => {
    await deploymentsStore.updateDeploymentDetails(id, payload)
  }

  const deleteDeployment = async (id: string) => {
    await deploymentsStore.deleteDeployment(id)
  }

  const getDeploymentById = async (id: string) => {
    return await deploymentsStore.fetchDeploymentById(id)
  }

  return { 
    filters,
    tableRows,
    pagination: computed(() => deployments.value.pagination),
    isLoading: computed(() => deployments.value.isLoading),
    error: computed(() => deployments.value.error),
    totalItems: computed(() => deployments.value.pagination.totalItems),
    loadDeployments,
    createDeployment,
    updateDeploymentDetails,
    updateDeploymentLocation,
    deleteDeployment,
    getDeploymentById,
  }
}
