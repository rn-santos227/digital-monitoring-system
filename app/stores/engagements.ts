import { defineStore } from 'pinia'
import type {
  EngagementManagementListItem,
  EngagementManagementSearchQuery,
  EngagementTablePagination,
} from '~/types/domain/engagement'
import { extractApiErrorMessage } from '~/utils/api-request'
import {
  getEngagementRecordsEndpoint,
  getEngagementsEndpoint,
  searchEngagementRecordsEndpoint,
  searchEngagementsEndpoint,
} from '~/utils/engagement-endpoints'

const DEFAULT_PAGINATION: EngagementTablePagination = {
  page: 1,
  pageSize: 10,
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
  }),

  getters: {
    hasEngagements: state => state.engagements.items.length > 0,
    hasRecords: state => state.records.items.length > 0,
  },

  actions: {
    async fetchEngagements(
      this: EngagementsStoreState,
      page = 1,
      filters: Partial<EngagementManagementSearchQuery> = {},
      pageSize?: number,
    ) {
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

    async fetchEngagementRecords(
      this: EngagementsStoreState,
      page = 1,
      filters: Partial<EngagementManagementSearchQuery> = {},
      pageSize?: number,
    ) {
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
