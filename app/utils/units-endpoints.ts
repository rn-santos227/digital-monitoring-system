import { API_LOADING_MESSAGES, UNIT_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  BattalionDetailItem,
  BattalionEndpointQuery,
  BattalionListItem,
  BattalionSearchQuery,
  CreateBattalionPayload,
  CreateBattalionResponse,
  CreateCompanyPayload,
  CreateCompanyResponse,
  CompanyDetailItem,
  CompanyEndpointQuery,
  CompanyListItem,
  CompanySearchQuery,
  UnitEquipmentAssetListItem,
  UpdateBattalionPayload,
  UpdateCompanyPayload,
  UnitManagementKpis,
  UnitListResponse,
  UnitPersonnelListItem,
  AssignUnitPersonnelPayload,
} from '~/types/domain/units'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const getBattalionsEndpoint = async (query: BattalionEndpointQuery): Promise<UnitListResponse<BattalionListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<UnitListResponse<BattalionListItem>>(UNIT_MANAGEMENT_API_ENDPOINTS.battalions, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchBattalions)
}

export const getUnitManagementPageKpisEndpoint = async (): Promise<UnitManagementKpis> => {
  return await withApiLoading(async () => {
    return await $fetch<UnitManagementKpis>(UNIT_MANAGEMENT_API_ENDPOINTS.kpis, {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchUnitManagementPageKpis)
}

export const searchBattalionsEndpoint = async (query: BattalionSearchQuery): Promise<UnitListResponse<BattalionListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<UnitListResponse<BattalionListItem>>(UNIT_MANAGEMENT_API_ENDPOINTS.battalionsSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchBattalions)
}

export const getCompaniesEndpoint = async (query: CompanyEndpointQuery): Promise<UnitListResponse<CompanyListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<UnitListResponse<CompanyListItem>>(UNIT_MANAGEMENT_API_ENDPOINTS.companies, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchCompanies)
}

export const searchCompaniesEndpoint = async (query: CompanySearchQuery): Promise<UnitListResponse<CompanyListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<UnitListResponse<CompanyListItem>>(UNIT_MANAGEMENT_API_ENDPOINTS.companiesSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchCompanies)
}

export const getBattalionSuggestionsEndpoint = async (query: { term?: string; pageSize?: number; selectedId?: string }): Promise<{ items: BattalionListItem[] }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ items: BattalionListItem[] }>(UNIT_MANAGEMENT_API_ENDPOINTS.battalionsSuggestions, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchBattalions, { useGlobalLoading: false })
}

export const getCompanySuggestionsEndpoint = async (query: { term?: string; pageSize?: number; selectedId?: string; battalionId?: string }): Promise<{ items: CompanyListItem[] }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ items: CompanyListItem[] }>(UNIT_MANAGEMENT_API_ENDPOINTS.companiesSuggestions, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchCompanies, { useGlobalLoading: false })
}

export const createBattalionEndpoint = async (payload: CreateBattalionPayload): Promise<CreateBattalionResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreateBattalionResponse>(UNIT_MANAGEMENT_API_ENDPOINTS.battalions, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createBattalion)
}

export const createCompanyEndpoint = async (payload: CreateCompanyPayload): Promise<CreateCompanyResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreateCompanyResponse>(UNIT_MANAGEMENT_API_ENDPOINTS.companies, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createCompany)
}

export const getBattalionByIdEndpoint = async (id: string): Promise<BattalionDetailItem> => {
  return await withApiLoading(async () => {
    return await $fetch<BattalionDetailItem>(UNIT_MANAGEMENT_API_ENDPOINTS.battalionById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchBattalions)
}

export const getBattalionPersonnelEndpoint = async (id: string, query: BattalionEndpointQuery): Promise<UnitListResponse<UnitPersonnelListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<UnitListResponse<UnitPersonnelListItem>>(UNIT_MANAGEMENT_API_ENDPOINTS.battalionPersonnel(id), {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchBattalions)
}

export const getBattalionEquipmentEndpoint = async (id: string, query: BattalionEndpointQuery): Promise<UnitListResponse<UnitEquipmentAssetListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<UnitListResponse<UnitEquipmentAssetListItem>>(UNIT_MANAGEMENT_API_ENDPOINTS.battalionEquipment(id), {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchBattalions)
}

export const getBattalionCompaniesEndpoint = async (id: string, query: BattalionEndpointQuery): Promise<UnitListResponse<CompanyListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<UnitListResponse<CompanyListItem>>(UNIT_MANAGEMENT_API_ENDPOINTS.battalionCompanies(id), {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchBattalions)
}

export const updateBattalionEndpoint = async (id: string, payload: UpdateBattalionPayload): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(UNIT_MANAGEMENT_API_ENDPOINTS.battalionById(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateBattalion)
}

export const deleteBattalionEndpoint = async (id: string): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(UNIT_MANAGEMENT_API_ENDPOINTS.battalionById(id), {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteBattalion)
}

export const getCompanyByIdEndpoint = async (id: string): Promise<CompanyDetailItem> => {
  return await withApiLoading(async () => {
    return await $fetch<CompanyDetailItem>(UNIT_MANAGEMENT_API_ENDPOINTS.companyById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchCompanies)
}

export const getCompanyPersonnelEndpoint = async (id: string, query: CompanyEndpointQuery): Promise<UnitListResponse<UnitPersonnelListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<UnitListResponse<UnitPersonnelListItem>>(UNIT_MANAGEMENT_API_ENDPOINTS.companyPersonnel(id), {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchCompanies)
}

export const getCompanyEquipmentEndpoint = async (id: string, query: CompanyEndpointQuery): Promise<UnitListResponse<UnitEquipmentAssetListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<UnitListResponse<UnitEquipmentAssetListItem>>(UNIT_MANAGEMENT_API_ENDPOINTS.companyEquipment(id), {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchCompanies)
}

export const updateCompanyEndpoint = async (id: string, payload: UpdateCompanyPayload): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(UNIT_MANAGEMENT_API_ENDPOINTS.companyById(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateCompany)
}

export const deleteCompanyEndpoint = async (id: string): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(UNIT_MANAGEMENT_API_ENDPOINTS.companyById(id), {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteCompany)
}

export const assignPersonnelToBattalionEndpoint = async (id: string, payload: AssignUnitPersonnelPayload): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(UNIT_MANAGEMENT_API_ENDPOINTS.battalionAssignPersonnel(id), {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.assignBattalionPersonnel)
}

export const assignPersonnelToCompanyEndpoint = async (id: string, payload: AssignUnitPersonnelPayload): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(UNIT_MANAGEMENT_API_ENDPOINTS.companyAssignPersonnel(id), {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.assignCompanyPersonnel)
}
