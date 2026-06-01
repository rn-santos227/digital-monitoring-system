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

const updateEquipmentCategoryKpis = (
  kpis: EquipmentCategoryKpiCounts,
  updates: Partial<EquipmentCategoryKpiCounts>,
): EquipmentCategoryKpiCounts => ({
  totalCategories: Math.max(0, updates.totalCategories ?? kpis.totalCategories),
  unusedCategories: Math.max(0, updates.unusedCategories ?? kpis.unusedCategories),
})

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
  },
})
