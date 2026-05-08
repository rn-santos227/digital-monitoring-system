import { defineStore } from 'pinia'
import type { CreateRankPayload, RankListItem, RankListQuery, RankState, RankTablePagination } from '~/types/domain/rank'
import { extractApiErrorMessage } from '~/utils/api-request'
import { createRankEndpoint, deleteRankEndpoint, getRanksEndpoint } from '~/utils/rank-endpoints'

const DEFAULT_RANK_PAGINATION: RankTablePagination = {
  page: 1,
  pageSize: 10,
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

interface RankStoreActionContext extends RankState {
  fetchRanks: (page?: number, search?: string) => Promise<void>
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
    async fetchRanks(this: RankStoreActionContext, page = 1, search = '', pageSize = this.pagination.pageSize) {
      this.isLoading = true
      this.error = ''
      this.searchTerm = search

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
        await this.fetchRanks(1, this.searchTerm)
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
        await this.fetchRanks(this.pagination.page, this.searchTerm)
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
