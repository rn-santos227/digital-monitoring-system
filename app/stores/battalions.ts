import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import { getBattalionsEndpoint, searchBattalionsEndpoint } from '~/utils/units-endpoints'
import type {
  BattalionsState,
  BattalionEndpointQuery,
  BattalionListItem,
  BattalionSearchQuery,
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

