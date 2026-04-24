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
