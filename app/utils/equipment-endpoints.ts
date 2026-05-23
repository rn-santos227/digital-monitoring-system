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

export const searchEquipmentCategoriesEndpoint = async (
  query: EquipmentCategorySearchQuery,
): Promise<EquipmentCategoryListResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentCategoryListResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentCategoriesSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentCategories)
}

export const createEquipmentCategoryEndpoint = async (
  body: CreateEquipmentCategoryPayload,
): Promise<CreateEquipmentCategoryResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreateEquipmentCategoryResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentCategories, {
      method: 'POST',
      headers: createSessionHeaders(),
      body,
    })
  }, API_LOADING_MESSAGES.createEquipmentCategory)
}

export const getEquipmentCategoryByIdEndpoint = async (
  id: string,
): Promise<EquipmentCategoryDetailItem> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentCategoryDetailItem>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentCategoryById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEquipmentCategories)
}

