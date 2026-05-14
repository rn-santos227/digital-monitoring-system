import { API_LOADING_MESSAGES, APPLICATION_SETTINGS_API_ENDPOINTS } from '~/constants/api.constants'
import type { ApplicationSettingsResponse, UpdateApplicationSettingsPayload } from '~/types/domain/application-settings'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const getApplicationSettingsEndpoint = async (): Promise<ApplicationSettingsResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<ApplicationSettingsResponse>(APPLICATION_SETTINGS_API_ENDPOINTS.settings, {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchApplicationSettings)
}

export const updateApplicationSettingsEndpoint = async (payload: UpdateApplicationSettingsPayload): Promise<ApplicationSettingsResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<ApplicationSettingsResponse>(APPLICATION_SETTINGS_API_ENDPOINTS.settings, {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateApplicationSettings)
}
