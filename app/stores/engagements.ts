import { defineStore } from 'pinia'
import type {
  EngagementManagementListItem,
  EngagementManagementSearchQuery,
  EngagementTablePagination,
} from '~/types/domain/engagement'
import { extractApiErrorMessage } from '~/utils/api-request'
import {
  getEngagementRecordsEndpoint,
  searchEngagementRecordsEndpoint,
} from '~/utils/engagement-endpoints'

const DEFAULT_PAGINATION: EngagementTablePagination = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
}

interface EngagementsStoreState {
  records: {
    items: EngagementManagementListItem[]
    pagination: EngagementTablePagination
    isLoading: boolean
    error: string
  }
}

export const useEngagementsStore = defineStore('engagements', {
  state: (): EngagementsStoreState => ({
    records: {
      items: [],
      pagination: { ...DEFAULT_PAGINATION },
      isLoading: false,
      error: '',
    },
  }),

  getters: {
    hasRecords: state => state.records.items.length > 0,
  },

  actions: {
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
