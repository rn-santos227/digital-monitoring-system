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
