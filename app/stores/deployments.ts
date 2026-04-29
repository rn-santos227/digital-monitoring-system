import { defineStore } from 'pinia'
import type {
  DeploymentManagementListItem,
  DeploymentManagementSearchQuery,
  DeploymentTablePagination,
} from '~/types/domain/deployment'
import { extractApiErrorMessage } from '~/utils/api-request'
import { getDeploymentRecordsEndpoint, getDeploymentsEndpoint, searchDeploymentsEndpoint } from '~/utils/deployment-endpoints'

const DEFAULT_PAGINATION: DeploymentTablePagination = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
}

interface DeploymentsStoreState {
  deployments: {
    items: DeploymentManagementListItem[]
    pagination: DeploymentTablePagination
    isLoading: boolean
    error: string
  }
  records: {
    items: DeploymentManagementListItem[]
    pagination: DeploymentTablePagination
    isLoading: boolean
    error: string
  }
}

export const useDeploymentsStore = defineStore('deployments', {
  state: (): DeploymentsStoreState => ({
    deployments: { items: [], pagination: { ...DEFAULT_PAGINATION }, isLoading: false, error: '' },
    records: { items: [], pagination: { ...DEFAULT_PAGINATION }, isLoading: false, error: '' },
  }),
  getters: {
    hasDeployments: state => state.deployments.items.length > 0,
  },
  actions: {
    async fetchDeployments(
      this: DeploymentsStoreState,
      page = 1,
      filters: Partial<DeploymentManagementSearchQuery> = {},
      pageSize?: number,
    ) {
      this.deployments.isLoading = true
      this.deployments.error = ''
      const resolvedPageSize = pageSize ?? this.deployments.pagination.pageSize
      const query: DeploymentManagementSearchQuery = { page, pageSize: resolvedPageSize, term: filters.term?.trim() || undefined, fields: filters.fields?.trim() || undefined }
      try {
        const response = query.term ? await searchDeploymentsEndpoint(query) : await getDeploymentsEndpoint(query)
        this.deployments.items = response.items
        this.deployments.pagination = { page: response.page, pageSize: response.pageSize, totalItems: response.totalItems, totalPages: response.totalPages }
      } catch (error) {
        this.deployments.items = []
        this.deployments.pagination = { ...DEFAULT_PAGINATION }
        this.deployments.error = extractApiErrorMessage(error, 'Unable to fetch deployments.')
      } finally { this.deployments.isLoading = false }
    },
    async fetchDeploymentRecords(
      this: DeploymentsStoreState,
      page = 1,
      filters: Partial<DeploymentManagementSearchQuery> = {},
      pageSize?: number,
    ) {
      this.records.isLoading = true
      this.records.error = ''
      const resolvedPageSize = pageSize ?? this.records.pagination.pageSize
      const query: DeploymentManagementSearchQuery = { page, pageSize: resolvedPageSize, term: filters.term?.trim() || undefined, fields: filters.fields?.trim() || undefined }
      try {
        const response = await getDeploymentRecordsEndpoint(query)
        this.records.items = response.items
        this.records.pagination = { page: response.page, pageSize: response.pageSize, totalItems: response.totalItems, totalPages: response.totalPages }
      } catch (error) {
        this.records.items = []
        this.records.pagination = { ...DEFAULT_PAGINATION }
        this.records.error = extractApiErrorMessage(error, 'Unable to fetch deployment records.')
      } finally { this.records.isLoading = false }
    },
  },
})
