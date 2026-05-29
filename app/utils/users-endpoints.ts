import { API_LOADING_MESSAGES, USER_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  CreateAccountTypePayload,
  CreateUserProfilePayload,
  UpdateUserActivationPayload,
  UpdateUserPasswordPayload,
  UpdateUserProfilePayload,
  UserProfileDetailEndpointResponse,
  UserProfileViewEndpointResponse,
  UserProfilesEndpointQuery,
  UserProfilesSearchQuery,
  UserProfilesEndpointResponse,
  UserAccountsEndpointQuery,
  UserAccountsSearchQuery,
  UserAccountsEndpointResponse,
  UserManagementKpiCounts,
  PrivilegesEndpointResponse,
  UpdateAccountTypePayload,
  UserAccountDetailEndpointResponse,
} from '~/types/domain/users'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const searchUserProfilesEndpoint = async (query: UserProfilesSearchQuery): Promise<UserProfilesEndpointResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<UserProfilesEndpointResponse>(USER_MANAGEMENT_API_ENDPOINTS.userProfilesSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchUserProfiles)
}

export const getUserProfilesEndpoint = async (query: UserProfilesEndpointQuery): Promise<UserProfilesEndpointResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<UserProfilesEndpointResponse>(USER_MANAGEMENT_API_ENDPOINTS.userProfiles, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchUserProfiles)
}

export const getUserManagementKpisEndpoint = async (): Promise<UserManagementKpiCounts> => {
  return await withApiLoading(async () => {
    return await $fetch<UserManagementKpiCounts>(USER_MANAGEMENT_API_ENDPOINTS.kpis, {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchUserManagementKpis)
}

export const searchUserAccountsEndpoint = async (query: UserAccountsSearchQuery): Promise<UserAccountsEndpointResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<UserAccountsEndpointResponse>(USER_MANAGEMENT_API_ENDPOINTS.accountTypesSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchUserAccounts)
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

export const getUserProfileViewByIdEndpoint = async (id: string): Promise<UserProfileViewEndpointResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<UserProfileViewEndpointResponse>(USER_MANAGEMENT_API_ENDPOINTS.userProfileById(id), {
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


export const getAccountTypeByIdEndpoint = async (id: string): Promise<UserAccountDetailEndpointResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<UserAccountDetailEndpointResponse>(USER_MANAGEMENT_API_ENDPOINTS.accountTypeById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchUserAccounts)
}

export const updateAccountTypeEndpoint = async (
  id: string,
  payload: UpdateAccountTypePayload,
): Promise<{ ok: true }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: true }>(USER_MANAGEMENT_API_ENDPOINTS.accountTypeById(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateAccountType)
}

export const deleteAccountTypeEndpoint = async (id: string): Promise<{ ok: true }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: true }>(USER_MANAGEMENT_API_ENDPOINTS.accountTypeById(id), {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteAccountType)
}
