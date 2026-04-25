import { API_LOADING_MESSAGES, UNIT_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  BattalionEndpointQuery,
  BattalionListItem,
  BattalionSearchQuery,
  CreateBattalionPayload,
  CreateCompanyPayload,
  CompanyEndpointQuery,
  CompanyListItem,
  CompanySearchQuery,
  UpdateBattalionPayload,
  UpdateCompanyPayload,
  UnitListResponse,
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

export const createBattalionEndpoint = async (payload: CreateBattalionPayload): Promise<{ ok: boolean; id: string }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean; id: string }>(UNIT_MANAGEMENT_API_ENDPOINTS.battalions, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createBattalion)
}

export const createCompanyEndpoint = async (payload: CreateCompanyPayload): Promise<{ ok: boolean; id: string }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean; id: string }>(UNIT_MANAGEMENT_API_ENDPOINTS.companies, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createCompany)
}

export const getBattalionByIdEndpoint = async (id: string): Promise<BattalionListItem> => {
  return await withApiLoading(async () => {
    return await $fetch<BattalionListItem>(UNIT_MANAGEMENT_API_ENDPOINTS.battalionById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
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

export const getCompanyByIdEndpoint = async (id: string): Promise<CompanyListItem> => {
  return await withApiLoading(async () => {
    return await $fetch<CompanyListItem>(UNIT_MANAGEMENT_API_ENDPOINTS.companyById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
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
