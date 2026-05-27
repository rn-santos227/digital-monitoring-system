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
  EquipmentCategorySuggestionQuery,
  EquipmentCategorySuggestionResponse,
  EquipmentItemListResponse,
  EquipmentItemSearchQuery,
  EquipmentItemSuggestionQuery,
  EquipmentItemSuggestionResponse,
  CreateEquipmentItemPayload,
  CreateEquipmentItemResponse,
  UpdateEquipmentCategoryPayload,
  UpdateEquipmentItemPayload,
} from '~/types/domain/equipment'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

const normalizeEquipmentCategoryQuery = (
  query: Partial<EquipmentCategorySearchQuery>,
): EquipmentCategorySearchQuery => {
  return {
    page: query.page,
    pageSize: query.pageSize,
    term: query.term?.trim() || undefined,
    fields: query.fields?.trim() || undefined,
    isActive: typeof query.isActive === 'boolean' ? query.isActive : undefined,
  }
}

export const hasEquipmentCategorySearchFilters = (
  query: Partial<EquipmentCategorySearchQuery>,
): boolean => {
  const normalizedQuery = normalizeEquipmentCategoryQuery(query)

  return Boolean(normalizedQuery.term) || typeof normalizedQuery.isActive === 'boolean'
}

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
  const normalizedQuery = normalizeEquipmentCategoryQuery(query)
  
  return await withApiLoading(async () => {
    return await $fetch<EquipmentCategoryListResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentCategoriesSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query: normalizedQuery,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentCategories)
}

export const getEquipmentCategorySuggestionsEndpoint = async (
  query: EquipmentCategorySuggestionQuery,
): Promise<EquipmentCategorySuggestionResponse> => {
  const normalizedQuery = {
    term: query.term?.trim() || undefined,
    pageSize: query.pageSize,
    selectedId: query.selectedId?.trim() || undefined,
  }

  return await withApiLoading(async () => {
    return await $fetch<EquipmentCategorySuggestionResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentCategoriesSuggestions, {
      method: 'GET',
      headers: createSessionHeaders(),
      query: normalizedQuery,
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

export const createEquipmentItemEndpoint = async (body: CreateEquipmentItemPayload): Promise<CreateEquipmentItemResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreateEquipmentItemResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentItems, {
      method: 'POST', headers: createSessionHeaders(), body,
    })
  }, API_LOADING_MESSAGES.createEquipmentItem)
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

export const getEquipmentItemByIdEndpoint = async (id: string): Promise<{ item: import('~/types/domain/equipment').EquipmentItemListItem }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ item: import('~/types/domain/equipment').EquipmentItemListItem }>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentItemById(id), {
      method: 'GET', headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEquipmentItems)
}

export const updateEquipmentCategoryEndpoint = async (
  id: string,
  body: UpdateEquipmentCategoryPayload,
): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentCategoryById(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body,
    })
  }, API_LOADING_MESSAGES.updateEquipmentCategory)
}

export const deleteEquipmentCategoryEndpoint = async (
  id: string,
): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentCategoryById(id), {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteEquipmentCategory)
}

const normalizeEquipmentItemQuery = (
  query: Partial<EquipmentItemSearchQuery>,
): EquipmentItemSearchQuery => {
  return {
    page: query.page,
    pageSize: query.pageSize,
    term: query.term?.trim() || undefined,
    fields: query.fields?.trim() || undefined,
  }
}

export const hasEquipmentItemSearchFilters = (
  query: Partial<EquipmentItemSearchQuery>,
): boolean => {
  const normalizedQuery = normalizeEquipmentItemQuery(query)

  return Boolean(normalizedQuery.term)
}

export const getEquipmentItemsEndpoint = async (
  query: EquipmentCategoryEndpointQuery,
): Promise<EquipmentItemListResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentItemListResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentItems, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentItems)
}

export const searchEquipmentItemsEndpoint = async (
  query: EquipmentItemSearchQuery,
): Promise<EquipmentItemListResponse> => {
  const normalizedQuery = normalizeEquipmentItemQuery(query)

  return await withApiLoading(async () => {
    return await $fetch<EquipmentItemListResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentItemsSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query: normalizedQuery,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentItems)
}
