import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import {
  createBattalionEndpoint,
  deleteBattalionEndpoint,
  getBattalionByIdEndpoint,
  getBattalionsEndpoint,
  searchBattalionsEndpoint,
  updateBattalionEndpoint,
  assignPersonnelToBattalionEndpoint,
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
  pageSize: resolveDefaultFetchPageSize(),
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
    async fetchBattalions(this: BattalionsState, page = 1, filters: Partial<BattalionSearchQuery> = {}, pageSize = this.pagination.pageSize) {
      this.isLoading = true
      this.error = ''

      const requestQuery: BattalionSearchQuery = {
        page,
        pageSize,
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
        this.pagination = { ...DEFAULT_PAGINATION, pageSize: resolveDefaultFetchPageSize() }
        this.error = extractApiErrorMessage(error, 'Unable to fetch battalions.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createBattalion(this: BattalionsState, payload: CreateBattalionPayload) {
      this.error = ''

      try {
        const response = await createBattalionEndpoint(payload)
        const createdBattalion: BattalionListItem = response.item
        this.items = [createdBattalion, ...this.items]
        this.pagination.totalItems += 1
        this.pagination.totalPages = Math.max(1, Math.ceil(this.pagination.totalItems / this.pagination.pageSize))

        return response
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

    async updateBattalion(this: BattalionsState, id: string, payload: UpdateBattalionPayload) {
      this.error = ''

      try {
        await updateBattalionEndpoint(id, payload)
        this.items = this.items.map(item => item.id === id ? { ...item, ...payload } : item)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update battalion.')
        throw error
      }
    },

    async assignPersonnel(this: BattalionsState, id: string, personnelId: string) {
      this.error = ''

      try {
        await assignPersonnelToBattalionEndpoint(id, { personnelId })
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to assign personnel to battalion.')
        throw error
      }
    },

    async deleteBattalion(this: BattalionsState, id: string) {
      this.error = ''

      try {
        await deleteBattalionEndpoint(id)
        const nextItems = this.items.filter(item => item.id !== id)
        if (nextItems.length !== this.items.length) {
          this.items = nextItems
          this.pagination.totalItems = Math.max(0, this.pagination.totalItems - 1)
          this.pagination.totalPages = this.pagination.totalItems === 0
            ? 0
            : Math.ceil(this.pagination.totalItems / this.pagination.pageSize)
        }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete battalion.')
        throw error
      }
    },
  },
}

export const useBattalionsStore = defineStore('battalions', battalionsStoreOptions)
