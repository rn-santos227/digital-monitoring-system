import { API_LOADING_MESSAGES, PERSONNEL_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  PersonnelEndpointQuery,
  CreatePersonnelPayload,
  CreatePersonnelResponse,
  PersonnelDetail,
  PersonnelListCompactResponse,
  PersonnelListResponse,
  PersonnelSearchQuery,
} from '~/types/domain/personnel'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const getPersonnelEndpoint = async (query: PersonnelEndpointQuery): Promise<PersonnelListResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<PersonnelListResponse>(PERSONNEL_API_ENDPOINTS.personnel, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchPersonnel)
}

export const searchPersonnelEndpoint = async (query: PersonnelSearchQuery): Promise<PersonnelListCompactResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<PersonnelListCompactResponse>(PERSONNEL_API_ENDPOINTS.personnelSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchPersonnel)
}

export const createPersonnelEndpoint = async (payload: CreatePersonnelPayload): Promise<CreatePersonnelResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreatePersonnelResponse>(PERSONNEL_API_ENDPOINTS.personnel, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createPersonnel)
}

export const getPersonnelByIdEndpoint = async (id: string): Promise<PersonnelDetail> => {
  return await withApiLoading(async () => {
    return await $fetch<PersonnelDetail>(PERSONNEL_API_ENDPOINTS.personnelById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchPersonnelDetails)
}
