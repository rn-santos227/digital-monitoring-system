import type {
  CreateEquipmentIssuancePayload,
  EquipmentIssuanceListItem,
  EquipmentIssuanceSearchQuery,
  EquipmentIssuancesState,
  UpdateEquipmentIssuancePayload,
} from '~/types/domain/equipment'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import {
  createEquipmentIssuanceEndpoint,
  deleteEquipmentIssuanceEndpoint,
  getEquipmentIssuanceByIdEndpoint,
  getEquipmentIssuancesEndpoint,
  hasEquipmentIssuanceSearchFilters,
  searchEquipmentIssuancesEndpoint,
  updateEquipmentIssuanceEndpoint,
} from '~/utils/equipment-endpoints'

const DEFAULT_EQUIPMENT_ISSUANCES_PAGINATION = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

export const useEquipmentIssuancesStore = defineStore('equipment-issuances', {
  state: (): EquipmentIssuancesState => ({
    items: [],
    pagination: { ...DEFAULT_EQUIPMENT_ISSUANCES_PAGINATION },
    isLoading: false,
    error: '',
  }),

  getters: {
    hasEquipmentIssuances: (state) => state.items.length > 0,
  },

  actions: {
    async fetchEquipmentIssuances(
      this: EquipmentIssuancesState,
      page = 1,
      filters: Partial<EquipmentIssuanceSearchQuery> = {},
      pageSize?: number,
    ) {
      this.isLoading = true
      this.error = ''

      const resolvedPageSize = pageSize ?? this.pagination.pageSize
      const query = {
        page,
        pageSize: resolvedPageSize,
        term: filters.term,
        issuedToPersonnelId: filters.issuedToPersonnelId,
        statusId: filters.statusId,
      }


      try {
        const response = hasEquipmentIssuanceSearchFilters(query)
          ? await searchEquipmentIssuancesEndpoint(query)
          : await getEquipmentIssuancesEndpoint(query)

        this.items = response.items
        this.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.items = []
        this.pagination = {
          ...DEFAULT_EQUIPMENT_ISSUANCES_PAGINATION,
          pageSize: resolveDefaultFetchPageSize(),
        }
        this.error = extractApiErrorMessage(error, 'Unable to fetch equipment issuances.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createEquipmentIssuance(this: EquipmentIssuancesState, payload: CreateEquipmentIssuancePayload) {
      this.error = ''
      try {
        const response = await createEquipmentIssuanceEndpoint(payload)
        this.items = [response.item, ...this.items]
        const nextTotalItems = this.pagination.totalItems + 1
        this.pagination.totalItems = nextTotalItems
        this.pagination.totalPages = Math.max(1, Math.ceil(nextTotalItems / this.pagination.pageSize))
        return response
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create equipment issuance.')
        throw error
      }
    },
  },
})
