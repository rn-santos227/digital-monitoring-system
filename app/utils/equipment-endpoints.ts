import {
  API_LOADING_MESSAGES,
  EQUIPMENT_MANAGEMENT_API_ENDPOINTS,
} from '~/constants/api.constants'
import type {
  CreateEquipmentCategoryPayload,
  CreateEquipmentCategoryResponse,
  EquipmentCategoryDetailItem,
  EquipmentCategoryEndpointQuery,
  EquipmentCategoryListResponse,
  EquipmentCategorySearchQuery,
  UpdateEquipmentCategoryPayload,
} from '~/types/domain/equipment'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'


export const getEquipmentCategoriesEndpoint = async (
  query: EquipmentCategoryEndpointQuery,
): Promise<EquipmentCategoryListResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentCategoryListResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentCategories, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentCategories)
}
