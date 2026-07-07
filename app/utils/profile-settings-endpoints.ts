import { USER_MANAGEMENT_API_ENDPOINTS, API_LOADING_MESSAGES } from '~/constants/api.constants'
import type { ProfileDetailsPayload, ProfileEmailPayload, ProfileOtherDetailsPayload, ProfilePasswordPayload } from '~/types/domain/profile'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const updateProfileDetailsEndpoint = async (userId: string, payload: ProfileDetailsPayload): Promise<{ ok: true }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: true }>(USER_MANAGEMENT_API_ENDPOINTS.userProfileById(userId), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateUserProfile)
}

export const updateProfileEmailEndpoint = async (userId: string, payload: ProfileEmailPayload): Promise<{ ok: true }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: true }>(USER_MANAGEMENT_API_ENDPOINTS.userProfileById(userId), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateUserProfile)
}

export const updateProfileOtherDetailsEndpoint = async (userId: string, payload: ProfileOtherDetailsPayload): Promise<{ ok: true }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: true }>(USER_MANAGEMENT_API_ENDPOINTS.userProfileById(userId), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateUserProfile)
}
