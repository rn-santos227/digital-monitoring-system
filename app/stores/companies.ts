import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import {
  createCompanyEndpoint,
  deleteCompanyEndpoint,
  getCompaniesEndpoint,
  getCompanyByIdEndpoint,
  searchCompaniesEndpoint,
  updateCompanyEndpoint,
} from '~/utils/units-endpoints'
import type {
  CompaniesState,
  CompanyDetailItem,
  CreateCompanyPayload,
  CompanyEndpointQuery,
  CompanyListItem,
  CompanySearchQuery,
  UpdateCompanyPayload,
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
    async fetchCompanies(this: CompaniesState, page = 1, filters: Partial<CompanySearchQuery> = {}, pageSize = this.pagination.pageSize) {
      this.isLoading = true
      this.error = ''

      const requestQuery: CompanySearchQuery = {
        page,
        pageSize,
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

    async createCompany(this: CompaniesState, payload: CreateCompanyPayload) {
      this.error = ''

      try {
        const response = await createCompanyEndpoint(payload)
        const createdCompany: CompanyListItem = response.item
        this.items = [createdCompany, ...this.items]
        this.pagination.totalItems += 1
        this.pagination.totalPages = Math.max(1, Math.ceil(this.pagination.totalItems / this.pagination.pageSize))

        return response
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create company.')
        throw error
      }
    },

    async getCompanyById(this: CompaniesState, id: string): Promise<CompanyDetailItem> {
      this.error = ''

      try {
        return await getCompanyByIdEndpoint(id)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to load company details.')
        throw error
      }
    },

    async updateCompany(
      this: CompaniesState,
      id: string,
      payload: UpdateCompanyPayload,
    ) {
      this.error = ''

      try {
        await updateCompanyEndpoint(id, payload)
        this.items = this.items.map(item => item.id === id ? { ...item, ...payload } : item)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update company.')
        throw error
      }
    },

    async deleteCompany(this: CompaniesState, id: string) {
      this.error = ''

      try {
        await deleteCompanyEndpoint(id)
        const nextItems = this.items.filter(item => item.id !== id)
        if (nextItems.length !== this.items.length) {
          this.items = nextItems
          this.pagination.totalItems = Math.max(0, this.pagination.totalItems - 1)
          this.pagination.totalPages = this.pagination.totalItems === 0
            ? 0
            : Math.ceil(this.pagination.totalItems / this.pagination.pageSize)
        }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete company.')
        throw error
      }
    },
  },
}

export const useCompaniesStore = defineStore('companies', companiesStoreOptions)
