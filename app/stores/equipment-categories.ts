import { updateEquipmentCategoryKpis } from '~/utils/equipment-category-state'
import { defineStore } from 'pinia'
import type {
  CreateEquipmentCategoryPayload,
  EquipmentCategoriesState,
  EquipmentCategoryKpiCounts,
  EquipmentCategorySearchQuery,
  UpdateEquipmentCategoryPayload,
} from '~/types/domain/equipment'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import {
  createEquipmentCategoryEndpoint,
  deleteEquipmentCategoryEndpoint,
  getEquipmentCategoriesEndpoint,
  getEquipmentCategoryByIdEndpoint,
  getEquipmentCategoryKpisEndpoint,
  hasEquipmentCategorySearchFilters,
  searchEquipmentCategoriesEndpoint,
  updateEquipmentCategoryEndpoint,
} from '~/utils/equipment-endpoints'

const DEFAULT_EQUIPMENT_CATEGORIES_PAGINATION = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const DEFAULT_EQUIPMENT_CATEGORY_KPIS: EquipmentCategoryKpiCounts = {
  totalCategories: 0,
  unusedCategories: 0,
}

export const useEquipmentCategoriesStore = defineStore('equipment-categories', {
  state: (): EquipmentCategoriesState => ({
    items: [],
    kpis: { ...DEFAULT_EQUIPMENT_CATEGORY_KPIS },
    hasLoadedKpis: false,
    pagination: { ...DEFAULT_EQUIPMENT_CATEGORIES_PAGINATION },
    isLoading: false,
    error: '',
  }),

  getters: {
    hasEquipmentCategories: (state) => state.items.length > 0,
    equipmentCategoryKpis: (state) => state.kpis,
  },

  actions: {
    async fetchEquipmentCategoryKpisOnce(this: EquipmentCategoriesState) {
      if (this.hasLoadedKpis) {
        return
      }

      this.error = ''

      try {
        this.kpis = await getEquipmentCategoryKpisEndpoint()
        this.hasLoadedKpis = true
      } catch (error) {
        this.kpis = { ...DEFAULT_EQUIPMENT_CATEGORY_KPIS }
        this.hasLoadedKpis = false
        this.error = extractApiErrorMessage(error, 'Unable to fetch equipment category KPI counts.')
        throw error
      }
    },

    applyEquipmentCategoryItemDelta(this: EquipmentCategoriesState, categoryId: string, delta: 1 | -1) {
      const category = this.items.find((item) => item.id === categoryId) ?? null
      const wasUnused = (category?.itemCount ?? 1) === 0

      this.items = this.items.map((item) => {
        if (item.id !== categoryId) {
          return item
        }

        return {
          ...item,
          itemCount: Math.max(0, item.itemCount + delta),
        }
      })

      if (!this.hasLoadedKpis || !category) {
        return
      }

      const nextItemCount = Math.max(0, category.itemCount + delta)
      const isUnused = nextItemCount === 0

      if (wasUnused === isUnused) {
        return
      }

      this.kpis = updateEquipmentCategoryKpis(this.kpis, {
        unusedCategories: this.kpis.unusedCategories + (isUnused ? 1 : -1),
      })
    },

    async fetchEquipmentCategories(
      this: EquipmentCategoriesState,
      page = 1,
      filters: Partial<EquipmentCategorySearchQuery> = {},
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
        isActive: filters.isActive,
      }

      try {
        const response = hasEquipmentCategorySearchFilters(query)
          ? await searchEquipmentCategoriesEndpoint(query)
          : await getEquipmentCategoriesEndpoint(query)

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
          ...DEFAULT_EQUIPMENT_CATEGORIES_PAGINATION,
          pageSize: resolveDefaultFetchPageSize(),
        }
        this.error = extractApiErrorMessage(error, 'Unable to fetch equipment categories.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createEquipmentCategory(this: EquipmentCategoriesState, payload: CreateEquipmentCategoryPayload) {
      this.error = ''
      try {
        const response = await createEquipmentCategoryEndpoint(payload)
        this.items = [response.item, ...this.items]
        const nextTotalItems = this.pagination.totalItems + 1
        this.pagination.totalItems = nextTotalItems
        this.pagination.totalPages = Math.max(1, Math.ceil(nextTotalItems / this.pagination.pageSize))
        if (this.hasLoadedKpis) {
          this.kpis = updateEquipmentCategoryKpis(this.kpis, {
            totalCategories: this.kpis.totalCategories + 1,
            unusedCategories: this.kpis.unusedCategories + 1,
          })
        }
        return response
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create equipment category.')
        throw error
      }
    },

    async getEquipmentCategoryById(this: EquipmentCategoriesState, id: string) {
      this.error = ''
      try {
        return await getEquipmentCategoryByIdEndpoint(id)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to load equipment category details.')
        throw error
      }
    },

    async updateEquipmentCategory(this: EquipmentCategoriesState, id: string, payload: UpdateEquipmentCategoryPayload) {
      this.error = ''
      try {
        await updateEquipmentCategoryEndpoint(id, payload)
        this.items = this.items.map((item) => (item.id === id ? { ...item, ...payload } : item))
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update equipment category.')
        throw error
      }
    },

    async deleteEquipmentCategory(this: EquipmentCategoriesState, id: string) {
      this.error = ''
      try {
        const deletedCategory = this.items.find((item) => item.id === id) ?? null
        await deleteEquipmentCategoryEndpoint(id)
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
        if (this.hasLoadedKpis && deletedCategory) {
          this.kpis = updateEquipmentCategoryKpis(this.kpis, {
            totalCategories: this.kpis.totalCategories - 1,
            unusedCategories: this.kpis.unusedCategories - 1,
          })
        }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete equipment category.')
        throw error
      }
    },
  },
})
