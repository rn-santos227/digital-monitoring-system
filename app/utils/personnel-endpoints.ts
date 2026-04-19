import { API_LOADING_MESSAGES, PERSONNEL_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  PersonnelEndpointQuery,
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
