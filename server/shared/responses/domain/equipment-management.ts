import type {
  EquipmentCategoryListItem,
  EquipmentCategoryListResponse,
  EquipmentCategorySuggestionResponse,
} from '../../models'

export interface CreateEquipmentCategoryApiResponse {
  ok: true
  id: string
  item: EquipmentCategoryListItem
}

export type EquipmentCategoryListApiResponse = EquipmentCategoryListResponse
export type EquipmentCategorySuggestionApiResponse = EquipmentCategorySuggestionResponse
