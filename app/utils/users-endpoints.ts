import { API_LOADING_MESSAGES, USER_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  UserProfilesEndpointQuery,
  UserProfilesEndpointResponse,
  UserAccountsEndpointQuery,
  UserAccountsEndpointResponse,
} from '~/types/domain/users'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const getUserProfilesEndpoint = async (query: UserProfilesEndpointQuery): Promise<UserProfilesEndpointResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<UserProfilesEndpointResponse>(USER_MANAGEMENT_API_ENDPOINTS.userProfiles, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchUserProfiles)
}

export const getUserAccountsEndpoint = async (query: UserAccountsEndpointQuery): Promise<UserAccountsEndpointResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<UserAccountsEndpointResponse>(USER_MANAGEMENT_API_ENDPOINTS.accountTypes, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchUserAccounts)
}
