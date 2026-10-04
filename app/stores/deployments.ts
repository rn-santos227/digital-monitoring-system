import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import type {
  CreateDeploymentPayload,
  CreateDeploymentRecordPayload,
  DeploymentManagementKpiCounts,
  DeploymentManagementListItem,
  DeploymentManagementSearchQuery,
  DeploymentTablePagination,
  UpdateDeploymentRecordPayload,
} from '~/types/domain/deployment'
import {
  createDeploymentEndpoint,
  getDeploymentByIdEndpoint,
  getDeploymentManagementKpisEndpoint,
  getDeploymentRecordsEndpoint,
  getDeploymentsEndpoint,
  searchDeploymentsEndpoint,
  searchDeploymentRecordsEndpoint,
  updateDeploymentDetailsEndpoint,
  updateDeploymentLocationEndpoint,
  deleteDeploymentEndpoint,
  createDeploymentRecordEndpoint,
  updateDeploymentRecordEndpoint,
  updateDeploymentRecordLocationEndpoint,
  deleteDeploymentRecordEndpoint,
  getDeploymentRecordByIdEndpoint,
} from '~/utils/deployment-endpoints'

const DEFAULT_PAGINATION: DeploymentTablePagination = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const DEFAULT_DEPLOYMENT_MANAGEMENT_KPIS: DeploymentManagementKpiCounts = {
  totalDeployments: 0,
  totalDeploymentRecords: 0,
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
  kpis: DeploymentManagementKpiCounts
  hasLoadedKpis: boolean
}

export const useDeploymentsStore = defineStore('deployments', {
  state: (): DeploymentsStoreState => ({
    deployments: {
      items: [],
      pagination: { ...DEFAULT_PAGINATION },
      isLoading: false,
      error: '',
    },
    records: {
      items: [],
      pagination: { ...DEFAULT_PAGINATION },
      isLoading: false,
      error: '',
    },
    kpis: { ...DEFAULT_DEPLOYMENT_MANAGEMENT_KPIS },
    hasLoadedKpis: false,
  }),
  getters: {
    hasDeployments: state => state.deployments.items.length > 0,
    deploymentManagementKpis: state => state.kpis,
  },
  actions: {
    async fetchDeploymentManagementKpisOnce(
      this: DeploymentsStoreState,
    ) {
      if (this.hasLoadedKpis) {
        return
      }

      this.deployments.error = ''

      try {
        this.kpis = await getDeploymentManagementKpisEndpoint()
        this.hasLoadedKpis = true
      } catch (error) {
        this.kpis = { ...DEFAULT_DEPLOYMENT_MANAGEMENT_KPIS }
        this.hasLoadedKpis = false
        this.deployments.error = extractApiErrorMessage(error, 'Unable to fetch deployment KPI counts.')
        throw error
      }
    },

    async fetchDeployments(
      this: DeploymentsStoreState,
      page = 1,
      filters: Partial<DeploymentManagementSearchQuery> = {},
      pageSize?: number,
    ) {
      this.deployments.isLoading = true
      this.deployments.error = ''
      const resolvedPageSize = pageSize ?? this.deployments.pagination.pageSize
      const query: DeploymentManagementSearchQuery = {
        page,
        pageSize: resolvedPageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
        conditions: filters.conditions?.trim() || undefined,
        match: filters.match,
      }
      try {
        const response = query.term || query.conditions
          ? await searchDeploymentsEndpoint(query)
          : await getDeploymentsEndpoint(query)
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
      const query: DeploymentManagementSearchQuery = {
        page,
        pageSize: resolvedPageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
        conditions: filters.conditions?.trim() || undefined,
        match: filters.match,
      }
      try {
        const response = query.term || query.conditions
          ? await searchDeploymentRecordsEndpoint(query)
          : await getDeploymentRecordsEndpoint(query)
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
        this.deployments.items = [
          ...this.deployments.items,
          response.item
        ]
        this.deployments.pagination.totalItems += 1
        this.deployments.pagination.totalPages = Math.max(1, Math.ceil(this.deployments.pagination.totalItems / this.deployments.pagination.pageSize))
        if (this.hasLoadedKpis) {
          this.kpis = {
            ...this.kpis,
            totalDeployments: this.kpis.totalDeployments + 1,
          }
        }
        return { id: response.id }
      } catch (error) {
        this.deployments.error = extractApiErrorMessage(error, 'Unable to create deployment.')
        throw error
      }
    },

    async createDeploymentRecord(this: DeploymentsStoreState, payload: CreateDeploymentRecordPayload): Promise<{ id: string }> {
      this.records.error = ''
      try {
        const response = await createDeploymentRecordEndpoint(payload)
        this.records.items = [
          response.item,
          ...this.records.items
        ]
        this.records.pagination.totalItems += 1
        this.records.pagination.totalPages = Math.max(1, Math.ceil(this.records.pagination.totalItems / this.records.pagination.pageSize))
        if (this.hasLoadedKpis) {
          this.kpis = {
            ...this.kpis,
            totalDeploymentRecords: this.kpis.totalDeploymentRecords + 1,
          }
        }
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

    async updateDeploymentRecord(this: DeploymentsStoreState, id: string, payload: UpdateDeploymentRecordPayload) {
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

    async updateDeploymentRecordLocation(this: DeploymentsStoreState, id: string, payload: UpdateDeploymentRecordPayload) {
      this.records.error = ''
      try {
        await updateDeploymentRecordLocationEndpoint(id, payload)
        const updated = await getDeploymentRecordByIdEndpoint(id)
        this.records.items = this.records.items.map(item => item.id === id ? updated : item)
      } catch (error) {
        this.records.error = extractApiErrorMessage(error, 'Unable to update deployment record location.')
        throw error
      }
    },

    async deleteDeployment(
      this: DeploymentsStoreState,
      id: string,
    ) {
      this.deployments.error = ''
      try {
        const deletedDeployment = this.deployments.items.find(item => item.id === id) ?? null
        await deleteDeploymentEndpoint(id)
        this.deployments.items = this.deployments.items.filter(item => item.id !== id)
        this.deployments.pagination.totalItems = Math.max(0, this.deployments.pagination.totalItems - 1)
        this.deployments.pagination.totalPages = this.deployments.pagination.totalItems === 0
          ? 0
          : Math.max(1, Math.ceil(this.deployments.pagination.totalItems / this.deployments.pagination.pageSize))
        if (this.hasLoadedKpis && deletedDeployment) {
          this.kpis = {
            ...this.kpis,
            totalDeployments: Math.max(0, this.kpis.totalDeployments - 1),
          }
        }
      } catch (error) {
        this.deployments.error = extractApiErrorMessage(error, 'Unable to delete deployment.')
        throw error
      }
    },

    async deleteDeploymentRecord(this: DeploymentsStoreState, id: string) {
      this.records.error = ''
      try {
        const previousLength = this.records.items.length
        await deleteDeploymentRecordEndpoint(id)
        this.records.items = this.records.items.filter(item => item.id !== id)
        const deletedItemCount = previousLength - this.records.items.length
        if (deletedItemCount > 0) {
          this.records.pagination.totalItems = Math.max(0, this.records.pagination.totalItems - deletedItemCount)
          this.records.pagination.totalPages = this.records.pagination.totalItems === 0
            ? 0
            : Math.max(1, Math.ceil(this.records.pagination.totalItems / this.records.pagination.pageSize))
        }
        if (this.hasLoadedKpis && deletedItemCount > 0) {
          this.kpis = {
            ...this.kpis,
            totalDeploymentRecords: Math.max(0, this.kpis.totalDeploymentRecords - deletedItemCount),
          }
        }
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
