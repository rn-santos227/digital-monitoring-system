import { defineStore } from 'pinia'
import type {
  CreateEquipmentItemPayload,
  EquipmentItemKpiCounts,
  EquipmentItemSearchQuery,
  EquipmentItemsState,
  UpdateEquipmentItemPayload,
} from '~/types/domain/equipment'
import { useEquipmentCategoriesStore } from '~/stores/equipment-categories'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import {
  createEquipmentItemEndpoint,
  deleteEquipmentItemEndpoint,
  getEquipmentItemByIdEndpoint,
  getEquipmentItemKpisEndpoint,
  getEquipmentItemsEndpoint,
  hasEquipmentItemSearchFilters,
  searchEquipmentItemsEndpoint,
  updateEquipmentItemEndpoint,
} from '~/utils/equipment-endpoints'

const DEFAULT_EQUIPMENT_ITEMS_PAGINATION = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const DEFAULT_EQUIPMENT_ITEM_KPIS: EquipmentItemKpiCounts = {
  totalItems: 0,
}

export const useEquipmentItemsStore = defineStore('equipment-items', {
  state: (): EquipmentItemsState => ({
    items: [],
    kpis: { ...DEFAULT_EQUIPMENT_ITEM_KPIS },
    hasLoadedKpis: false,
    pagination: { ...DEFAULT_EQUIPMENT_ITEMS_PAGINATION },
    isLoading: false,
    error: '',
  }),

  getters: {
    hasEquipmentItems: (state) => state.items.length > 0,
    equipmentItemKpis: (state) => state.kpis,
  },

  actions: {
    async fetchEquipmentItemKpisOnce(this: EquipmentItemsState) {
      if (this.hasLoadedKpis) {
        return
      }

      this.error = ''

      try {
        this.kpis = await getEquipmentItemKpisEndpoint()
        this.hasLoadedKpis = true
      } catch (error) {
        this.kpis = { ...DEFAULT_EQUIPMENT_ITEM_KPIS }
        this.hasLoadedKpis = false
        this.error = extractApiErrorMessage(error, 'Unable to fetch equipment item KPI counts.')
        throw error
      }
    },
    async fetchEquipmentItems(
      this: EquipmentItemsState,
      page = 1,
      filters: Partial<EquipmentItemSearchQuery> = {},
      pageSize?: number,
    ) {
      this.isLoading = true
      this.error = ''

      const resolvedPageSize = pageSize ?? this.pagination.pageSize
      const query = {
        page,
        pageSize: resolvedPageSize,
        term: filters.term,
        fields: filters.fields,
        conditions: filters.conditions,
        match: filters.match,
      }

      try {
        const response = hasEquipmentItemSearchFilters(query)
          ? await searchEquipmentItemsEndpoint(query)
          : await getEquipmentItemsEndpoint(query)

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
          ...DEFAULT_EQUIPMENT_ITEMS_PAGINATION,
          pageSize: resolveDefaultFetchPageSize(),
        }
        this.error = extractApiErrorMessage(error, 'Unable to fetch equipment items.')
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async createEquipmentItem(this: EquipmentItemsState, payload: CreateEquipmentItemPayload) {
      this.error = ''
      try {
        const response = await createEquipmentItemEndpoint(payload)
        this.items = [response.item, ...this.items]
        const nextTotalItems = this.pagination.totalItems + 1
        this.pagination.totalItems = nextTotalItems
        this.pagination.totalPages = Math.max(1, Math.ceil(nextTotalItems / this.pagination.pageSize))
        if (this.hasLoadedKpis) {
          this.kpis = {
            totalItems: this.kpis.totalItems + 1,
          }
        }
        useEquipmentCategoriesStore().applyEquipmentCategoryItemDelta(response.item.categoryId, 1)
        return response
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create equipment item.')
        throw error
      }
    },
    async getEquipmentItemById(this: EquipmentItemsState, id: string) {
      this.error = ''
      try {
        const response = await getEquipmentItemByIdEndpoint(id)
        return response.item
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to load equipment item details.')
        throw error
      }
    },
    async updateEquipmentItem(this: EquipmentItemsState, id: string, payload: UpdateEquipmentItemPayload) {
      this.error = ''
      try {
        await updateEquipmentItemEndpoint(id, payload)
        this.items = this.items.map((item) => (item.id === id ? { ...item, ...payload } : item))
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update equipment item.')
        throw error
      }
    },
    async deleteEquipmentItem(this: EquipmentItemsState, id: string) {
      this.error = ''
      try {
        const deletedItem = this.items.find((item) => item.id === id) ?? null
        await deleteEquipmentItemEndpoint(id)
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
        if (this.hasLoadedKpis) {
          this.kpis = {
            totalItems: Math.max(0, this.kpis.totalItems - deletedItemCount),
          }
        }
        if (deletedItem) {
          useEquipmentCategoriesStore().applyEquipmentCategoryItemDelta(deletedItem.categoryId, -1)
        }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete equipment item.')
        throw error
      }
    },
  },
})
