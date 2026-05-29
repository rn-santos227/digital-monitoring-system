import { defineStore } from 'pinia'
import type {
  CreateEquipmentAssetPayload,
  CreateEquipmentCategoryPayload,
  CreateEquipmentItemPayload,
  EquipmentAssetKpiCounts,
  EquipmentAssetListItem,
  EquipmentCategoriesState,
  EquipmentCategorySearchQuery,
  EquipmentAssetsState,
  EquipmentAssetSearchQuery,
  EquipmentItemsState,
  EquipmentItemSearchQuery,
  UpdateEquipmentAssetPayload,
  UpdateEquipmentCategoryPayload,
  UpdateEquipmentItemPayload,
} from '~/types/domain/equipment'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import {
  createEquipmentAssetEndpoint,
  createEquipmentCategoryEndpoint,
  createEquipmentItemEndpoint,
  deleteEquipmentAssetEndpoint,
  deleteEquipmentCategoryEndpoint,
  deleteEquipmentItemEndpoint,
  getEquipmentAssetByIdEndpoint,
  getEquipmentAssetKpisEndpoint,
  getEquipmentAssetsEndpoint,
  hasEquipmentAssetSearchFilters,
  searchEquipmentAssetsEndpoint,
  getEquipmentCategoriesEndpoint,
  getEquipmentCategoryByIdEndpoint,
  getEquipmentItemByIdEndpoint,
  getEquipmentItemsEndpoint,
  hasEquipmentCategorySearchFilters,
  hasEquipmentItemSearchFilters,
  searchEquipmentCategoriesEndpoint,
  searchEquipmentItemsEndpoint,
  updateEquipmentAssetEndpoint,
  updateEquipmentCategoryEndpoint,
  updateEquipmentItemEndpoint,
} from '~/utils/equipment-endpoints'

const DEFAULT_EQUIPMENT_CATEGORIES_PAGINATION = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const DEFAULT_EQUIPMENT_ASSETS_PAGINATION = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const DEFAULT_EQUIPMENT_ASSET_KPIS: EquipmentAssetKpiCounts = {
  totalAssets: 0,
  issuedAssets: 0,
  notIssuedAssets: 0,
}

const DEFAULT_EQUIPMENT_ITEMS_PAGINATION = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const isIssuedEquipmentAsset = (asset: Pick<EquipmentAssetListItem, 'assetStatusName'> | null | undefined) => {
  return asset?.assetStatusName.toLowerCase().includes('issued') ?? false
}

const applyEquipmentAssetKpiDelta = (
  kpis: EquipmentAssetKpiCounts,
  asset: EquipmentAssetListItem,
  delta: 1 | -1,
): EquipmentAssetKpiCounts => {
  const totalAssets = Math.max(0, kpis.totalAssets + delta)
  const issuedAssets = Math.max(0, kpis.issuedAssets + (isIssuedEquipmentAsset(asset) ? delta : 0))

  return {
    totalAssets,
    issuedAssets,
    notIssuedAssets: Math.max(0, totalAssets - issuedAssets),
  }
}

const applyEquipmentAssetStatusTransition = (
  kpis: EquipmentAssetKpiCounts,
  previousAsset: EquipmentAssetListItem,
  nextAsset: EquipmentAssetListItem,
): EquipmentAssetKpiCounts => {
  const wasIssued = isIssuedEquipmentAsset(previousAsset)
  const isIssued = isIssuedEquipmentAsset(nextAsset)

  if (wasIssued === isIssued) {
    return kpis
  }

  const issuedAssets = Math.max(0, kpis.issuedAssets + (isIssued ? 1 : -1))

  return {
    totalAssets: kpis.totalAssets,
    issuedAssets,
    notIssuedAssets: Math.max(0, kpis.totalAssets - issuedAssets),
  }
}

export const useEquipmentCategoriesStore = defineStore('equipment-categories', {
  state: (): EquipmentCategoriesState => ({
    items: [],
    pagination: { ...DEFAULT_EQUIPMENT_CATEGORIES_PAGINATION },
    isLoading: false,
    error: '',
  }),
  getters: {
    hasEquipmentCategories: (state) => state.items.length > 0,
  },
  actions: {
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
    async createEquipmentCategory(this: EquipmentCategoriesState, payload: CreateEquipmentCategoryPayload) {
      this.error = ''
      try {
        const response = await createEquipmentCategoryEndpoint(payload)
        this.items = [response.item, ...this.items]
        const nextTotalItems = this.pagination.totalItems + 1
        this.pagination.totalItems = nextTotalItems
        this.pagination.totalPages = Math.max(1, Math.ceil(nextTotalItems / this.pagination.pageSize))
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
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete equipment category.')
        throw error
      }
    },
  },
})

export const useEquipmentAssetsStore = defineStore('equipment-assets', {
  state: (): EquipmentAssetsState => ({
    items: [],
    kpis: { ...DEFAULT_EQUIPMENT_ASSET_KPIS },
    hasLoadedKpis: false,
    pagination: { ...DEFAULT_EQUIPMENT_ASSETS_PAGINATION },
    isLoading: false,
    error: '',
  }),
  getters: {
    hasEquipmentAssets: (state) => state.items.length > 0,
    equipmentAssetKpis: (state) => state.kpis,
  },
  actions: {
    async fetchEquipmentAssetKpisOnce(this: EquipmentAssetsState) {
      if (this.hasLoadedKpis) {
        return
      }

      this.error = ''

      try {
        this.kpis = await getEquipmentAssetKpisEndpoint()
        this.hasLoadedKpis = true
      } catch (error) {
        this.kpis = { ...DEFAULT_EQUIPMENT_ASSET_KPIS }
        this.hasLoadedKpis = false
        this.error = extractApiErrorMessage(error, 'Unable to fetch equipment asset KPI counts.')
        throw error
      }
    },
    async fetchEquipmentAssets(this: EquipmentAssetsState, page = 1, filters: Partial<EquipmentAssetSearchQuery> = {}, pageSize?: number) {
      this.isLoading = true
      this.error = ''
      const resolvedPageSize = pageSize ?? this.pagination.pageSize
      const query = { page, pageSize: resolvedPageSize, term: filters.term, fields: filters.fields }
      try {
        const response = hasEquipmentAssetSearchFilters(query)
          ? await searchEquipmentAssetsEndpoint(query)
          : await getEquipmentAssetsEndpoint(query)
        this.items = response.items
        this.pagination = { page: response.page, pageSize: response.pageSize, totalItems: response.totalItems, totalPages: response.totalPages }
      } catch (error) {
        this.items = []
        this.pagination = { ...DEFAULT_EQUIPMENT_ASSETS_PAGINATION, pageSize: resolveDefaultFetchPageSize() }
        this.error = extractApiErrorMessage(error, 'Unable to fetch equipment assets.')
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async createEquipmentAsset(this: EquipmentAssetsState, payload: CreateEquipmentAssetPayload) {
      this.error = ''
      try {
        const response = await createEquipmentAssetEndpoint(payload)
        this.items = [response.item, ...this.items]
        const nextTotalItems = this.pagination.totalItems + 1
        this.pagination.totalItems = nextTotalItems
        this.pagination.totalPages = Math.max(1, Math.ceil(nextTotalItems / this.pagination.pageSize))

        if (this.hasLoadedKpis) {
          this.kpis = applyEquipmentAssetKpiDelta(this.kpis, response.item, 1)
        }

        return response
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create equipment asset.')
        throw error
      }
    },
    async getEquipmentAssetById(this: EquipmentAssetsState, id: string) {
      this.error = ''
      try {
        const response = await getEquipmentAssetByIdEndpoint(id)
        return response.item
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to load equipment asset details.')
        throw error
      }
    },
    async updateEquipmentAsset(this: EquipmentAssetsState, id: string, payload: UpdateEquipmentAssetPayload) {
      this.error = ''
      const previousAsset = this.items.find((item) => item.id === id) ?? null

      try {
        await updateEquipmentAssetEndpoint(id, payload)
        const response = await getEquipmentAssetByIdEndpoint(id)
        this.items = this.items.map((item) => (item.id === id ? response.item : item))

        if (this.hasLoadedKpis && previousAsset) {
          this.kpis = applyEquipmentAssetStatusTransition(this.kpis, previousAsset, response.item)
        }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update equipment asset.')
        throw error
      }
    },
    async deleteEquipmentAsset(this: EquipmentAssetsState, id: string) {
      this.error = ''
      const deletedAsset = this.items.find((item) => item.id === id) ?? null

      try {
        await deleteEquipmentAssetEndpoint(id)
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

        if (this.hasLoadedKpis && deletedAsset) {
          this.kpis = applyEquipmentAssetKpiDelta(this.kpis, deletedAsset, -1)
        }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete equipment asset.')
        throw error
      }
    },
  },
})

export const useEquipmentItemsStore = defineStore('equipment-items', {
  state: (): EquipmentItemsState => ({
    items: [],
    pagination: { ...DEFAULT_EQUIPMENT_ITEMS_PAGINATION },
    isLoading: false,
    error: '',
  }),
  getters: {
    hasEquipmentItems: (state) => state.items.length > 0,
  },
  actions: {
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
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete equipment item.')
        throw error
      }
    },
  },
})
