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


})
