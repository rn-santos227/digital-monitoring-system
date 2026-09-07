import { defineStore } from 'pinia'
import type { CreateRankPayload, RankListItem, RankListQuery, RankState, RankTablePagination } from '~/types/domain/rank'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import { createRankEndpoint, deleteRankEndpoint, getRanksEndpoint, searchRanksEndpoint } from '~/utils/rank-endpoints'
import { usePersonnelStore } from '~/stores/personnel'

const DEFAULT_RANK_PAGINATION: RankTablePagination = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const INITIAL_RANK_STATE: RankState = {
  items: [],
  pagination: { ...DEFAULT_RANK_PAGINATION },
  isLoading: false,
  error: '',
  searchTerm: '',
}

const doesRankMatchSearch = (rank: Pick<RankListItem, 'code' | 'name'>, searchTerm: string) => {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  if (!normalizedSearchTerm) {
    return true
  }

  return rank.code.toLowerCase().includes(normalizedSearchTerm) || rank.name.toLowerCase().includes(normalizedSearchTerm)
}

const recalculateRankPaginationTotals = (pagination: RankTablePagination, totalItems: number): RankTablePagination => {
  const normalizedTotalPages = totalItems > 0 ? Math.ceil(totalItems / pagination.pageSize) : 0

  return {
    ...pagination,
    totalItems,
    totalPages: normalizedTotalPages,
    page: normalizedTotalPages === 0 ? 1 : Math.min(pagination.page, normalizedTotalPages),
  }
}

const buildCreatedRankItem = (payload: CreateRankPayload, id: string): RankListItem => {
  const nowIsoTimestamp = new Date().toISOString()

  return {
    id,
    code: payload.code,
    name: payload.name,
    sortOrder: payload.sortOrder,
    createdAt: nowIsoTimestamp,
    updatedAt: nowIsoTimestamp,
  }
}

interface RankStoreActionContext extends RankState {
  fetchRanks: (page?: number, filters?: Partial<RankListQuery>) => Promise<void>
}

const rankStoreOptions = {
  state: (): RankState => ({
    ...INITIAL_RANK_STATE,
    pagination: { ...DEFAULT_RANK_PAGINATION },
  }),

  getters: {
    hasRankItems: (state: RankState) => state.items.length > 0,
  },

  actions: {
   async fetchRanks(this: RankStoreActionContext, page = 1, filters: Partial<RankListQuery> = {}, pageSize = this.pagination.pageSize) {
      this.isLoading = true
      this.error = ''
      this.searchTerm = filters.term ?? filters.search ?? ''

      const query: RankListQuery = {
        page,
        pageSize,
        search: search.trim() || undefined,
      }

      try {
        const response = await getRanksEndpoint(query)
        this.items = response.items
        this.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.items = []
        this.pagination = { ...DEFAULT_RANK_PAGINATION }
        this.error = extractApiErrorMessage(error, 'Unable to fetch rank records.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createRank(this: RankStoreActionContext, payload: CreateRankPayload) {
      this.isLoading = true
      this.error = ''

      try {
        const result = await createRankEndpoint(payload)
        const createdRank = buildCreatedRankItem(payload, result.id)

        if (doesRankMatchSearch(createdRank, this.searchTerm)) {
          this.items = [...this.items, createdRank]
          this.pagination = recalculateRankPaginationTotals(this.pagination, this.pagination.totalItems + 1)
        }

        usePersonnelStore().applyRankKpiDelta(1)

        return result
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create rank record.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteRank(this: RankStoreActionContext, id: string) {
      this.isLoading = true
      this.error = ''

      try {
        const result = await deleteRankEndpoint(id)
        const nextItems = this.items.filter((rank) => rank.id !== id)
        const wasRankPresent = nextItems.length !== this.items.length

        this.items = nextItems
        if (wasRankPresent) {
          this.pagination = recalculateRankPaginationTotals(this.pagination, Math.max(this.pagination.totalItems - 1, 0))
        }

        usePersonnelStore().applyRankKpiDelta(-1)

        return result
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete rank record.')
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
}

export const useRanksStore = defineStore('ranks', rankStoreOptions)
