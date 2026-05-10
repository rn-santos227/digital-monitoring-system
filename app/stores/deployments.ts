import { defineStore } from 'pinia'
import type {
  CreateDeploymentPayload,
  DeploymentManagementListItem,
  DeploymentManagementSearchQuery,
  DeploymentTablePagination,
} from '~/types/domain/deployment'
import { extractApiErrorMessage } from '~/utils/api-request'
import { 
  createDeploymentEndpoint,
  getDeploymentRecordsEndpoint,
  getDeploymentsEndpoint,
  searchDeploymentsEndpoint,
  updateDeploymentDetailsEndpoint,
  updateDeploymentLocationEndpoint,
  deleteDeploymentEndpoint,
  createDeploymentRecordEndpoint,
  updateDeploymentRecordEndpoint,
  deleteDeploymentRecordEndpoint,
  getDeploymentRecordByIdEndpoint
} from '~/utils/deployment-endpoints'

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

    async createDeployment(
      this: DeploymentsStoreState,
      payload: CreateDeploymentPayload,
    ): Promise<{ id: string }> {
      this.deployments.error = ''
      try {
        const response = await createDeploymentEndpoint(payload)
        const createdDeployment = await getDeploymentByIdEndpoint(response.id)
        this.deployments.items = [...this.deployments.items, createdDeployment]
        this.deployments.pagination.totalItems += 1
        this.deployments.pagination.totalPages = Math.max(1, Math.ceil(this.deployments.pagination.totalItems / this.deployments.pagination.pageSize))
        return { id: response.id }
      } catch (error) {
        this.deployments.error = extractApiErrorMessage(error, 'Unable to create deployment.')
        throw error
      }
    },

    async createDeploymentRecord(this: DeploymentsStoreState, payload: import('~/types/domain/deployment').CreateDeploymentRecordPayload): Promise<{ id: string }> {
      this.records.error = ''
      try {
        const response = await createDeploymentRecordEndpoint(payload)
        const created = await getDeploymentRecordByIdEndpoint(response.id)
        this.records.items = [created, ...this.records.items]
        this.records.pagination.totalItems += 1
        this.records.pagination.totalPages = Math.max(1, Math.ceil(this.records.pagination.totalItems / this.records.pagination.pageSize))
        return { id: response.id }
      } catch (error) {
        this.records.error = extractApiErrorMessage(error, 'Unable to create deployment record.')
        throw error
      }
    },

    async updateDeploymentDetails(
      this: DeploymentsStoreState,
      id: string,
      payload: CreateDeploymentPayload,
    ) {
      this.deployments.error = ''
      try {
        await updateDeploymentDetailsEndpoint(id, payload)
        const updatedDeployment = await getDeploymentByIdEndpoint(id)
        this.deployments.items = this.deployments.items.map(item => item.id === id ? updatedDeployment : item)
      } catch (error) {
        this.deployments.error = extractApiErrorMessage(error, 'Unable to update deployment details.')
        throw error
      }
    },

    async updateDeploymentLocation(
      this: DeploymentsStoreState,
      id: string,
      payload: CreateDeploymentPayload,
    ) {
      this.deployments.error = ''
      try {
        await updateDeploymentLocationEndpoint(id, payload)
        const updatedDeployment = await getDeploymentByIdEndpoint(id)
        this.deployments.items = this.deployments.items.map(item => item.id === id ? updatedDeployment : item)
      } catch (error) {
        this.deployments.error = extractApiErrorMessage(error, 'Unable to update deployment location.')
        throw error
      }
    },

    async updateDeploymentRecord(this: DeploymentsStoreState, id: string, payload: import('~/types/domain/deployment').UpdateDeploymentRecordPayload) {
      this.records.error = ''
      try {
        await updateDeploymentRecordEndpoint(id, payload)
        const updated = await getDeploymentRecordByIdEndpoint(id)
        this.records.items = this.records.items.map(item => item.id === id ? updated : item)
      } catch (error) {
        this.records.error = extractApiErrorMessage(error, 'Unable to update deployment record.')
        throw error
      }
    },

    async deleteDeployment(
      this: DeploymentsStoreState,
      id: string,
    ) {
      this.deployments.error = ''
      try {
        await deleteDeploymentEndpoint(id)
        this.deployments.items = this.deployments.items.filter(item => item.id !== id)
        this.deployments.pagination.totalItems = Math.max(0, this.deployments.pagination.totalItems - 1)
        this.deployments.pagination.totalPages = this.deployments.pagination.totalItems === 0
          ? 0
          : Math.max(1, Math.ceil(this.deployments.pagination.totalItems / this.deployments.pagination.pageSize))
      } catch (error) {
        this.deployments.error = extractApiErrorMessage(error, 'Unable to delete deployment.')
        throw error
      }
    },

    async deleteDeploymentRecord(this: DeploymentsStoreState, id: string) {
      this.records.error = ''
      try {
        await deleteDeploymentRecordEndpoint(id)
        this.records.items = this.records.items.filter(item => item.id !== id)
      } catch (error) {
        this.records.error = extractApiErrorMessage(error, 'Unable to delete deployment record.')
        throw error
      }
    },

    async fetchDeploymentById(this: DeploymentsStoreState, id: string) {
      this.deployments.error = ''
      try {
        return await getDeploymentByIdEndpoint(id)
      } catch (error) {
        this.deployments.error = extractApiErrorMessage(error, 'Unable to fetch deployment details.')
        throw error
      }
    },

    async fetchDeploymentRecordById(this: DeploymentsStoreState, id: string) {
      this.records.error = ''
      try {
        return await getDeploymentRecordByIdEndpoint(id)
      } catch (error) {
        this.records.error = extractApiErrorMessage(error, 'Unable to fetch deployment record details.')
        throw error
      }
    },
  },
})
