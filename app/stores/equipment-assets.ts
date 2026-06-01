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

