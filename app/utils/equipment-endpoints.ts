import {
  API_LOADING_MESSAGES,
  EQUIPMENT_MANAGEMENT_API_ENDPOINTS,
} from '~/constants/api.constants'
import type {
  CreateEquipmentCategoryPayload,
  CreateEquipmentCategoryResponse,
  CreateEquipmentAssetPayload,
  CreateEquipmentAssetResponse,
  EquipmentCategoryDetailItem,
  EquipmentCategoryEndpointQuery,
  EquipmentCategoryKpiCounts,
  EquipmentCategoryListResponse,
  EquipmentCategorySearchQuery,
  EquipmentCategorySuggestionQuery,
  EquipmentCategorySuggestionResponse,
  EquipmentAssetKpiCounts,
  EquipmentAssetListItem,
  EquipmentAssetListResponse,
  EquipmentAssetSearchQuery,
  EquipmentAssetSuggestionQuery,
  EquipmentAssetSuggestionResponse,
  EquipmentItemKpiCounts,
  EquipmentItemListItem,
  EquipmentItemListResponse,
  EquipmentItemSearchQuery,
  EquipmentItemSuggestionQuery,
  EquipmentItemSuggestionResponse,
  CreateEquipmentItemPayload,
  CreateEquipmentItemResponse,
  CreateEquipmentIssuancePayload,
  CreateEquipmentIssuanceResponse,
  EquipmentIssuanceListItem,
  EquipmentIssuanceListResponse,
  EquipmentIssuanceSearchQuery,
  UpdateEquipmentAssetPayload,
  UpdateEquipmentCategoryPayload,
  UpdateEquipmentItemPayload,
  UpdateEquipmentIssuancePayload,
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

const normalizeEquipmentAssetQuery = (
  query: Partial<EquipmentAssetSearchQuery>,
): EquipmentAssetSearchQuery => {
  return {
    page: query.page,
    pageSize: query.pageSize,
    term: query.term?.trim() || undefined,
    fields: query.fields?.trim() || undefined,
  }
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

const normalizeEquipmentIssuanceQuery = (
  query: Partial<EquipmentIssuanceSearchQuery>,
): EquipmentIssuanceSearchQuery => {
  return {
    page: query.page,
    pageSize: query.pageSize,
    term: query.term?.trim() || undefined,
    issuedToPersonnelId: query.issuedToPersonnelId?.trim() || undefined,
    statusId: query.statusId?.trim() || undefined,
  }
}

export const hasEquipmentCategorySearchFilters = (
  query: Partial<EquipmentCategorySearchQuery>,
): boolean => {
  const normalizedQuery = normalizeEquipmentCategoryQuery(query)

  return Boolean(normalizedQuery.term) || typeof normalizedQuery.isActive === 'boolean'
}

export const hasEquipmentItemSearchFilters = (
  query: Partial<EquipmentItemSearchQuery>,
): boolean => {
  const normalizedQuery = normalizeEquipmentItemQuery(query)

  return Boolean(normalizedQuery.term)
}

export const hasEquipmentAssetSearchFilters = (
  query: Partial<EquipmentAssetSearchQuery>,
): boolean => {
  const normalizedQuery = normalizeEquipmentAssetQuery(query)

  return Boolean(normalizedQuery.term)
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

export const getEquipmentAssetsEndpoint = async (
  query: EquipmentCategoryEndpointQuery,
): Promise<EquipmentAssetListResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentAssetListResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentAssets, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentAssets)
}

export const getEquipmentAssetKpisEndpoint = async (): Promise<EquipmentAssetKpiCounts> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentAssetKpiCounts>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentAssetsKpis, {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEquipmentAssetKpis)
}

export const getEquipmentCategoryKpisEndpoint = async (): Promise<EquipmentCategoryKpiCounts> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentCategoryKpiCounts>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentCategoriesKpis, {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEquipmentCategoryKpis)
}

export const getEquipmentItemKpisEndpoint = async (): Promise<EquipmentItemKpiCounts> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentItemKpiCounts>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentItemsKpis, {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEquipmentItemKpis)
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

export const getEquipmentIssuancesEndpoint = async (
  query: EquipmentCategoryEndpointQuery,
): Promise<EquipmentIssuanceListResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentIssuanceListResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentIssuances, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentIssuances)
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

export const searchEquipmentAssetsEndpoint = async (
  query: EquipmentAssetSearchQuery,
): Promise<EquipmentAssetListResponse> => {
  const normalizedQuery = normalizeEquipmentAssetQuery(query)

  return await withApiLoading(async () => {
    return await $fetch<EquipmentAssetListResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentAssetsSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query: normalizedQuery,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentAssets)
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

export const searchEquipmentIssuancesEndpoint = async (
  query: EquipmentIssuanceSearchQuery,
): Promise<EquipmentIssuanceListResponse> => {
  const normalizedQuery = normalizeEquipmentIssuanceQuery(query)

  return await withApiLoading(async () => {
    return await $fetch<EquipmentIssuanceListResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentIssuancesSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query: normalizedQuery,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentIssuances)
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

export const getEquipmentItemSuggestionsEndpoint = async (
  query: EquipmentItemSuggestionQuery,
): Promise<EquipmentItemSuggestionResponse> => {
  const normalizedQuery = {
    term: query.term?.trim() || undefined,
    pageSize: query.pageSize,
    selectedId: query.selectedId?.trim() || undefined,
  }

  return await withApiLoading(async () => {
    return await $fetch<EquipmentItemSuggestionResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentItemsSuggestions, {
      method: 'GET',
      headers: createSessionHeaders(),
      query: normalizedQuery,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentItems)
}

export const getEquipmentAssetSuggestionsEndpoint = async (
  query: EquipmentAssetSuggestionQuery,
): Promise<EquipmentAssetSuggestionResponse> => {
  const normalizedQuery = {
    term: query.term?.trim() || undefined,
    pageSize: query.pageSize,
    selectedId: query.selectedId?.trim() || undefined,
  }

  return await withApiLoading(async () => {
    return await $fetch<EquipmentAssetSuggestionResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentAssetsSuggestions, {
      method: 'GET',
      headers: createSessionHeaders(),
      query: normalizedQuery,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentAssets)
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

export const createEquipmentAssetEndpoint = async (body: CreateEquipmentAssetPayload): Promise<CreateEquipmentAssetResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreateEquipmentAssetResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentAssets, {
      method: 'POST',
      headers: createSessionHeaders(),
      body,
    })
  }, API_LOADING_MESSAGES.createEquipmentAsset)
}

export const createEquipmentIssuanceEndpoint = async (
  body: CreateEquipmentIssuancePayload,
): Promise<CreateEquipmentIssuanceResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreateEquipmentIssuanceResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentIssuances, {
      method: 'POST',
      headers: createSessionHeaders(),
      body,
    })
  }, API_LOADING_MESSAGES.createEquipmentIssuance)
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

export const getEquipmentItemsByCategoryEndpoint = async (
  categoryId: string,
  query: EquipmentCategoryEndpointQuery,
): Promise<EquipmentItemListResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentItemListResponse>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentCategoryItemsById(categoryId), {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentItems)
}

export const getEquipmentItemByIdEndpoint = async (id: string): Promise<{ item: EquipmentItemListItem }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ item: EquipmentItemListItem }>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentItemById(id), {
      method: 'GET', headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEquipmentItems)
}

export const getEquipmentAssetByIdEndpoint = async (id: string): Promise<{ item: EquipmentAssetListItem }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ item: EquipmentAssetListItem }>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentAssetById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEquipmentAssets)
}

export const getEquipmentIssuanceByIdEndpoint = async (
  id: string,
): Promise<{ item: EquipmentIssuanceListItem }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ item: EquipmentIssuanceListItem }>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentIssuanceById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEquipmentIssuances)
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

export const updateEquipmentItemEndpoint = async (id: string, body: UpdateEquipmentItemPayload): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentItemById(id), {
      method: 'PATCH', headers: createSessionHeaders(), body,
    })
  }, API_LOADING_MESSAGES.updateEquipmentItem)
}

export const updateEquipmentAssetEndpoint = async (id: string, body: UpdateEquipmentAssetPayload): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentAssetById(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body,
    })
  }, API_LOADING_MESSAGES.updateEquipmentAsset)
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

export const deleteEquipmentItemEndpoint = async (id: string): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentItemById(id), {
      method: 'DELETE', headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteEquipmentItem)
}

export const deleteEquipmentAssetEndpoint = async (id: string): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(EQUIPMENT_MANAGEMENT_API_ENDPOINTS.equipmentAssetById(id), {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteEquipmentAsset)
}
