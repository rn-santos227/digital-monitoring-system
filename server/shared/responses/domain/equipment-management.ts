import type {
  EquipmentCategoryListItem,
  EquipmentCategoryListResponse,
  EquipmentCategorySuggestionResponse,
  EquipmentItemListItem,
  EquipmentItemListResponse,
  EquipmentItemSuggestionResponse,
} from '../../models'

export interface CreateEquipmentCategoryApiResponse {
  ok: true
  id: string
  item: EquipmentCategoryListItem
}

export type EquipmentCategoryListApiResponse = EquipmentCategoryListResponse
export type EquipmentCategorySuggestionApiResponse = EquipmentCategorySuggestionResponse

export interface CreateEquipmentItemApiResponse {
  ok: true
  id: string
  item: EquipmentItemListItem
}

export type EquipmentItemListApiResponse = EquipmentItemListResponse
export type EquipmentItemSuggestionApiResponse = EquipmentItemSuggestionResponse
