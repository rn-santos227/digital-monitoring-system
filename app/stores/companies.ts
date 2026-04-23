import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import { getCompaniesEndpoint, searchCompaniesEndpoint } from '~/utils/units-endpoints'
import type {
  CompaniesState,
  CompanyEndpointQuery,
  CompanyListItem,
  CompanySearchQuery,
  UnitsTablePagination,
} from '~/types/domain/units'

const DEFAULT_PAGINATION: UnitsTablePagination = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
}

const INITIAL_COMPANIES_STATE: CompaniesState = {
  items: [],
  pagination: { ...DEFAULT_PAGINATION },
  isLoading: false,
  error: '',
}

const companiesStoreOptions = {
  state: (): CompaniesState => ({
    ...INITIAL_COMPANIES_STATE,
    pagination: { ...DEFAULT_PAGINATION },
  }),

  getters: {
    hasCompanies: (state: CompaniesState) => state.items.length > 0,
  },

  actions: {
    async fetchCompanies(this: CompaniesState, page = 1, filters: Partial<CompanySearchQuery> = {}) {
      this.isLoading = true
      this.error = ''

      const requestQuery: CompanySearchQuery = {
        page,
        pageSize: this.pagination.pageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
        isActive: typeof filters.isActive === 'boolean' ? filters.isActive : undefined,
        battalionId: filters.battalionId?.trim() || undefined,
      }

      const hasSearchFilters = Boolean(
        requestQuery.term
        || typeof requestQuery.isActive === 'boolean'
        || requestQuery.battalionId,
      )

      try {
        const response = hasSearchFilters
          ? await searchCompaniesEndpoint(requestQuery)
          : await getCompaniesEndpoint(requestQuery as CompanyEndpointQuery)

        this.items = response.items.map((item): CompanyListItem => ({
          id: item.id,
          battalionId: item.battalionId,
          battalionCode: item.battalionCode,
          battalionName: item.battalionName,
          code: item.code,
          name: item.name,
          isActive: item.isActive,
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
        this.error = extractApiErrorMessage(error, 'Unable to fetch companies.')
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
}

export const useCompaniesStore = defineStore('companies', companiesStoreOptions)
