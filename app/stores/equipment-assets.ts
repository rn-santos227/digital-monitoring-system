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


