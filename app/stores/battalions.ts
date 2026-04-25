import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import {
  createBattalionEndpoint,
  deleteBattalionEndpoint,
  getBattalionByIdEndpoint,
  getBattalionsEndpoint,
  searchBattalionsEndpoint,
  updateBattalionEndpoint,
} from '~/utils/units-endpoints'
import type {
  BattalionsState,
  BattalionEndpointQuery,
  BattalionDetailItem,
  BattalionListItem,
  BattalionSearchQuery,
  CreateBattalionPayload,
  UpdateBattalionPayload,
  UnitsTablePagination,
} from '~/types/domain/units'

const DEFAULT_PAGINATION: UnitsTablePagination = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
}

const INITIAL_BATTALIONS_STATE: BattalionsState = {
  items: [],
  pagination: { ...DEFAULT_PAGINATION },
  isLoading: false,
  error: '',
}

const battalionsStoreOptions = {
  state: (): BattalionsState => ({
    ...INITIAL_BATTALIONS_STATE,
    pagination: { ...DEFAULT_PAGINATION },
  }),

  getters: {
    hasBattalions: (state: BattalionsState) => state.items.length > 0,
  },

  actions: {
    async fetchBattalions(this: BattalionsState, page = 1, filters: Partial<BattalionSearchQuery> = {}) {
      this.isLoading = true
      this.error = ''

      const requestQuery: BattalionSearchQuery = {
        page,
        pageSize: this.pagination.pageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
        isActive: typeof filters.isActive === 'boolean' ? filters.isActive : undefined,
      }

      const hasSearchFilters = Boolean(requestQuery.term || typeof requestQuery.isActive === 'boolean')

      try {
        const response = hasSearchFilters
          ? await searchBattalionsEndpoint(requestQuery)
          : await getBattalionsEndpoint(requestQuery as BattalionEndpointQuery)

        this.items = response.items.map((item): BattalionListItem => ({
          id: item.id,
          code: item.code,
          name: item.name,
          isActive: item.isActive,
          companyCount: item.companyCount,
        }))
        this.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.items = []
        this.pagination = { ...DEFAULT_PAGINATION }
        this.error = extractApiErrorMessage(error, 'Unable to fetch battalions.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createBattalion(
      this: BattalionsState & {
        fetchBattalions: (page?: number, filters?: Partial<BattalionSearchQuery>) => Promise<void>
      },
      payload: CreateBattalionPayload,
    ) {
      this.error = ''

      try {
        await createBattalionEndpoint(payload)
        await this.fetchBattalions(1)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create battalion.')
        throw error
      }
    },

    async getBattalionById(this: BattalionsState, id: string): Promise<BattalionDetailItem> {
      this.error = ''

      try {
        return await getBattalionByIdEndpoint(id)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to load battalion details.')
        throw error
      }
    },

    async updateBattalion(
      this: BattalionsState & {
        fetchBattalions: (page?: number, filters?: Partial<BattalionSearchQuery>) => Promise<void>
      },
      id: string,
      payload: UpdateBattalionPayload,
    ) {
      this.error = ''

      try {
        await updateBattalionEndpoint(id, payload)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update battalion.')
        throw error
      }
    },

    async deleteBattalion(this: BattalionsState, id: string) {
      this.error = ''

      try {
        await deleteBattalionEndpoint(id)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete battalion.')
        throw error
      }
    },
  },
}

export const useBattalionsStore = defineStore('battalions', battalionsStoreOptions)
