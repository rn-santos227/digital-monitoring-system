import { defineStore } from 'pinia'
import type {
  CreateEquipmentAssetPayload,
  EquipmentAssetKpiCounts,
  EquipmentAssetListItem,
  EquipmentAssetSearchQuery,
  EquipmentAssetsState,
  UpdateEquipmentAssetPayload,
} from '~/types/domain/equipment'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import {
  createEquipmentAssetEndpoint,
  deleteEquipmentAssetEndpoint,
  getEquipmentAssetByIdEndpoint,
  getEquipmentAssetKpisEndpoint,
  getEquipmentAssetsEndpoint,
  hasEquipmentAssetSearchFilters,
  searchEquipmentAssetsEndpoint,
  updateEquipmentAssetEndpoint,
} from '~/utils/equipment-endpoints'

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
    async fetchEquipmentAssets(
      this: EquipmentAssetsState,
      page = 1,
      filters: Partial<EquipmentAssetSearchQuery> = {},
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
        const response = hasEquipmentAssetSearchFilters(query)
          ? await searchEquipmentAssetsEndpoint(query)
          : await getEquipmentAssetsEndpoint(query)
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
          ...DEFAULT_EQUIPMENT_ASSETS_PAGINATION,
          pageSize: resolveDefaultFetchPageSize(),
        }
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
  },
})
