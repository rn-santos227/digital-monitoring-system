import { API_LOADING_MESSAGES, USER_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  CreateAccountTypePayload,
  CreateUserProfilePayload,
  UpdateUserActivationPayload,
  UpdateUserPasswordPayload,
  UpdateUserProfilePayload,
  UserProfileDetailEndpointResponse,
  UserProfilesEndpointQuery,
  UserProfilesEndpointResponse,
  UserAccountsEndpointQuery,
  UserAccountsEndpointResponse,
  PrivilegesEndpointResponse,
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

export const createUserProfileEndpoint = async (payload: CreateUserProfilePayload): Promise<{ ok: true; id: string | null }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: true; id: string | null }>(USER_MANAGEMENT_API_ENDPOINTS.userProfiles, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createUserProfile)
}

export const getUserProfileByIdEndpoint = async (id: string): Promise<UserProfileDetailEndpointResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<UserProfileDetailEndpointResponse>(USER_MANAGEMENT_API_ENDPOINTS.userProfileById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchUserProfiles)
}

export const updateUserProfileEndpoint = async (
  id: string,
  payload: UpdateUserProfilePayload,
): Promise<{ ok: true }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: true }>(USER_MANAGEMENT_API_ENDPOINTS.userProfileById(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateUserProfile)
}

export const updateUserPasswordEndpoint = async (
  id: string,
  payload: UpdateUserPasswordPayload,
): Promise<{ ok: true }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: true }>(USER_MANAGEMENT_API_ENDPOINTS.userProfilePassword(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateUserPassword)
}

export const updateUserActivationEndpoint = async (
  id: string,
  payload: UpdateUserActivationPayload,
): Promise<{ ok: true }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: true }>(USER_MANAGEMENT_API_ENDPOINTS.userProfileActivation(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateUserActivation)
}

export const deleteUserProfileEndpoint = async (id: string): Promise<{ ok: true }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: true }>(USER_MANAGEMENT_API_ENDPOINTS.userProfileById(id), {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteUserProfile)
}

export const getPrivilegesEndpoint = async (): Promise<PrivilegesEndpointResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<PrivilegesEndpointResponse>(USER_MANAGEMENT_API_ENDPOINTS.privileges, {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchPrivileges)
}

export const createAccountTypeEndpoint = async (payload: CreateAccountTypePayload): Promise<{ ok: true; id: string | null }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: true; id: string | null }>(USER_MANAGEMENT_API_ENDPOINTS.accountTypes, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createAccountType)
}
