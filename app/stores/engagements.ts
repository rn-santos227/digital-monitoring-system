import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import type {
  CreateEngagementPayload,
  CreateEngagementRecordPayload,
  EngagementManagementListItem,
  EngagementManagementSearchQuery,
  EngagementPersonnelListItem,
  EngagementTablePagination,
} from '~/types/domain/engagement'
import {
  createEngagementEndpoint,
  createEngagementRecordEndpoint,
  deleteEngagementEndpoint,
  getEngagementByIdEndpoint,
  getEngagementPersonnelEndpoint,
  getEngagementRecordsEndpoint,
  getEngagementsEndpoint,
  searchEngagementRecordsEndpoint,
  searchEngagementsEndpoint,
  updateEngagementEndpoint,
} from '~/utils/engagement-endpoints'

const DEFAULT_PAGINATION: EngagementTablePagination = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

interface EngagementsStoreSection {
  items: EngagementManagementListItem[]
  pagination: EngagementTablePagination
  isLoading: boolean
  error: string
}

interface EngagementsStoreState {
  engagements: EngagementsStoreSection
  records: EngagementsStoreSection
  selectedEngagement: EngagementManagementListItem | null
  engagementPersonnel: EngagementPersonnelListItem[]
}

export const useEngagementsStore = defineStore('engagements', {
  state: (): EngagementsStoreState => ({
    engagements: {
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
    selectedEngagement: null,
    engagementPersonnel: [],
  }),

  getters: {
    hasEngagements: state => state.engagements.items.length > 0,
    hasRecords: state => state.records.items.length > 0,
  },

  actions: {
    async fetchEngagements(this: EngagementsStoreState, page = 1, filters: Partial<EngagementManagementSearchQuery> = {}, pageSize?: number) {
      this.engagements.isLoading = true
      this.engagements.error = ''

      const resolvedPageSize = pageSize ?? this.engagements.pagination.pageSize
      const query: EngagementManagementSearchQuery = {
        page,
        pageSize: resolvedPageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
      }

      try {
        const response = query.term
          ? await searchEngagementsEndpoint(query)
          : await getEngagementsEndpoint(query)

        this.engagements.items = response.items
        this.engagements.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.engagements.items = []
        this.engagements.pagination = { ...DEFAULT_PAGINATION }
        this.engagements.error = extractApiErrorMessage(error, 'Unable to fetch engagements.')
      } finally {
        this.engagements.isLoading = false
      }
    },
    
    async createEngagement(this: EngagementsStoreState, payload: CreateEngagementPayload): Promise<{ id: string }> {
      this.engagements.error = ''

      try {
        const response = await createEngagementEndpoint(payload)
        this.engagements.items = [response.item, ...this.engagements.items]
        this.engagements.pagination.totalItems += 1
        this.engagements.pagination.totalPages = Math.max(
          1,
          Math.ceil(this.engagements.pagination.totalItems / this.engagements.pagination.pageSize),
        )

        return { id: response.id }
      } catch (error) {
        this.engagements.error = extractApiErrorMessage(error, 'Unable to create engagement.')
        throw error
      }
    },

    async createEngagementRecord(this: EngagementsStoreState, payload: CreateEngagementRecordPayload): Promise<{ id: string }> {
      this.records.error = ''
      try {
        const response = await createEngagementRecordEndpoint(payload)
        this.records.items = [response.item, ...this.records.items]
        this.records.pagination.totalItems += 1
        this.records.pagination.totalPages = Math.max(1, Math.ceil(this.records.pagination.totalItems / this.records.pagination.pageSize))
        return { id: response.id }
      } catch (error) {
        this.records.error = extractApiErrorMessage(error, 'Unable to create engagement record.')
        throw error
      }
    },

    async updateEngagement(this: EngagementsStoreState, id: string, payload: CreateEngagementPayload): Promise<void> {
      this.engagements.error = ''

      try {
        const response = await updateEngagementEndpoint(id, payload)
        this.engagements.items = this.engagements.items.map(item => (item.id === id ? response.item : item))
        this.selectedEngagement = response.item
      } catch (error) {
        this.engagements.error = extractApiErrorMessage(error, 'Unable to update engagement.')
        throw error
      }
    },

    async deleteEngagement(this: EngagementsStoreState, id: string): Promise<void> {
      this.engagements.error = ''

      try {
        await deleteEngagementEndpoint(id)
        this.engagements.items = this.engagements.items.filter(item => item.id !== id)
        this.engagements.pagination.totalItems = Math.max(0, this.engagements.pagination.totalItems - 1)
      } catch (error) {
        this.engagements.error = extractApiErrorMessage(error, 'Unable to delete engagement.')
        throw error
      }
    },

    async getEngagementById(this: EngagementsStoreState, id: string): Promise<EngagementManagementListItem> {
      const item = await getEngagementByIdEndpoint(id)
      this.selectedEngagement = item
      return item
    },

    async fetchEngagementPersonnel(this: EngagementsStoreState, id: string): Promise<EngagementPersonnelListItem[]> {
      const response = await getEngagementPersonnelEndpoint(id)
      this.engagementPersonnel = response.items
      return response.items
    },

    async fetchEngagementRecords(this: EngagementsStoreState, page = 1, filters: Partial<EngagementManagementSearchQuery> = {}, pageSize?: number) {
      this.records.isLoading = true
      this.records.error = ''

      const resolvedPageSize = pageSize ?? this.records.pagination.pageSize
      const query: EngagementManagementSearchQuery = {
        page,
        pageSize: resolvedPageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
      }

      try {
        const response = query.term
          ? await searchEngagementRecordsEndpoint(query)
          : await getEngagementRecordsEndpoint(query)

        this.records.items = response.items
        this.records.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.records.items = []
        this.records.pagination = { ...DEFAULT_PAGINATION }
        this.records.error = extractApiErrorMessage(error, 'Unable to fetch engagement records.')
      } finally {
        this.records.isLoading = false
      }
    },
  },
})
