import type {
  EquipmentAssetListItem,
  EquipmentAssetListResponse,
  EquipmentAssetKpiCounts,
  EquipmentAssetSuggestionResponse,
  EquipmentCategoryKpiCounts,
  EquipmentCategoryListItem,
  EquipmentCategoryListResponse,
  EquipmentCategorySuggestionResponse,
  EquipmentItemKpiCounts,
  EquipmentItemListItem,
  EquipmentItemListResponse,
  EquipmentItemSuggestionResponse,
  EquipmentIssuanceListItem,
  EquipmentIssuanceListResponse,
} from '../../models'

export interface CreateEquipmentCategoryApiResponse {
  ok: true
  id: string
  item: EquipmentCategoryListItem
}

export type EquipmentCategoryListApiResponse = EquipmentCategoryListResponse
export type EquipmentCategoryKpiApiResponse = EquipmentCategoryKpiCounts
export type EquipmentCategorySuggestionApiResponse = EquipmentCategorySuggestionResponse

export interface CreateEquipmentItemApiResponse {
  ok: true
  id: string
  item: EquipmentItemListItem
}

export type EquipmentItemListApiResponse = EquipmentItemListResponse
export type EquipmentItemKpiApiResponse = EquipmentItemKpiCounts
export type EquipmentItemSuggestionApiResponse = EquipmentItemSuggestionResponse

export interface CreateEquipmentAssetApiResponse {
  ok: true
  id: string
  item: EquipmentAssetListItem
}

export type EquipmentAssetListApiResponse = EquipmentAssetListResponse
export type EquipmentAssetKpiApiResponse = EquipmentAssetKpiCounts
export type EquipmentAssetSuggestionApiResponse = EquipmentAssetSuggestionResponse

export interface CreateEquipmentIssuanceApiResponse {
  ok: true
  id: string
  item: EquipmentIssuanceListItem
}

export type EquipmentIssuanceListApiResponse = EquipmentIssuanceListResponse
