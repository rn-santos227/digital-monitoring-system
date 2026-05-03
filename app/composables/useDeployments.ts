import { computed, ref } from 'vue'
import type { CreateDeploymentPayload, DeploymentManagementListItem, DeploymentManagementSearchQuery } from '~/types/domain/deployment'
import { useDeploymentsStore } from '~/stores/deployments'

export const useDeployments = () => {
  const store = useDeploymentsStore()
  const filters = ref<Partial<DeploymentManagementSearchQuery>>({})

  const normalizeDisplayValue = (value: unknown): string => {
    if (typeof value === 'string') {
      return value.trim().length > 0 ? value : '—'
    }

    return '—'
  }

  const resolveDeploymentStatus = (item: DeploymentManagementListItem & { statusName?: string | null }): string =>
    normalizeDisplayValue(item.statusName ?? item.status)

  const tableRows = computed(() => store.deployments.items.map(item => ({
    id: item.id,
    operationName: normalizeDisplayValue(item.operationName),
    deploymentArea: normalizeDisplayValue(item.deploymentArea),
    assignmentRole: item.assignmentRole ?? '',
    deploymentAreaLatitude: item.deploymentAreaLatitude ?? '',
    deploymentAreaLongitude: item.deploymentAreaLongitude ?? '',
    startDate: item.startDate ?? '',
    endDate: normalizeDisplayValue(item.endDate),
    status: resolveDeploymentStatus(item as DeploymentManagementListItem & { statusName?: string | null }),
    statusId: item.statusId ?? '',
    location: item.location ?? '',
    supervisorId: item.supervisorId ?? '',
    defaultRemarks: item.defaultRemarks ?? '',
  })))

  const loadDeployments = async (page = store.deployments.pagination.page, nextFilters: Partial<DeploymentManagementSearchQuery> = filters.value, pageSize = store.deployments.pagination.pageSize) => {
    filters.value = { ...nextFilters }
    await store.fetchDeployments(page, filters.value, pageSize)
  }

  const createDeployment = async (payload: CreateDeploymentPayload) => {
    await store.createDeployment(payload)
  }

  const updateDeploymentDetails = async (id: string, payload: CreateDeploymentPayload) => {
    await store.updateDeploymentDetails(id, payload)
  }

  const updateDeploymentLocation = async (id: string, payload: CreateDeploymentPayload) => {
    await store.updateDeploymentLocation(id, payload)
  }

  const deleteDeployment = async (id: string) => {
    await store.deleteDeployment(id)
  }

  return { 
    filters,
    tableRows,
    pagination: computed(() => store.deployments.pagination),
    isLoading: computed(() => store.deployments.isLoading),
    error: computed(() => store.deployments.error),
    loadDeployments,
    createDeployment,
    updateDeploymentDetails,
    updateDeploymentLocation,
    deleteDeployment
  }
}
