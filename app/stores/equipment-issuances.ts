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
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: '',
    createError: '',
    updateError: '',
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
        statusName: filters.statusName,
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
      this.isCreating = true
      this.error = ''
      this.createError = ''

      try {
        const response = await createEquipmentIssuanceEndpoint(payload)
        this.items = [response.item, ...this.items]
        const nextTotalItems = this.pagination.totalItems + 1
        this.pagination.totalItems = nextTotalItems
        this.pagination.totalPages = Math.max(1, Math.ceil(nextTotalItems / this.pagination.pageSize))
        return response
      } catch (error) {
        const message = extractApiErrorMessage(error, 'Unable to create equipment issuance.')
        this.error = message
        this.createError = message
        throw error
      } finally {
        this.isCreating = false
      }
    },

    async getEquipmentIssuanceById(this: EquipmentIssuancesState, id: string) {
      this.error = ''
      try {
        const response = await getEquipmentIssuanceByIdEndpoint(id)
        return response.item
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to load equipment issuance details.')
        throw error
      }
    },

    async updateEquipmentIssuance(this: EquipmentIssuancesState, id: string, payload: UpdateEquipmentIssuancePayload) {
      this.isUpdating = true
      this.error = ''
      this.updateError = ''
  
      try {
        await updateEquipmentIssuanceEndpoint(id, payload)
        const updatedResponse = await getEquipmentIssuanceByIdEndpoint(id)
        this.items = this.items.map((item: EquipmentIssuanceListItem) => (item.id === id ? updatedResponse.item : item))
      } catch (error) {
        const message = extractApiErrorMessage(error, 'Unable to update equipment issuance.')
        this.error = message
        this.updateError = message
        throw error
      } finally {
        this.isUpdating = false
      }
    },

    async deleteEquipmentIssuance(this: EquipmentIssuancesState, id: string) {
      this.isDeleting = true
      this.error = ''
      try {
        await deleteEquipmentIssuanceEndpoint(id)
        const previousLength = this.items.length
        this.items = this.items.filter((item) => item.id !== id)
        const deletedItemCount = previousLength - this.items.length
        if (deletedItemCount <= 0) {
          return
        }
        const nextTotalItems = Math.max(0, this.pagination.totalItems - deletedItemCount)
        this.pagination.totalItems = nextTotalItems
        this.pagination.totalPages = nextTotalItems === 0
          ? 0
          : Math.max(1, Math.ceil(nextTotalItems / this.pagination.pageSize))
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete equipment issuance.')
        throw error
      } finally {
        this.isDeleting = false
      }
    },
  },
})
