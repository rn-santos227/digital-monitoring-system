import { NOTIFICATION_API_ENDPOINTS } from '~/constants/api.constants'
import type { NotificationListResponse } from '~/types/domain/notification'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const getNotificationsEndpoint = async (): Promise<NotificationListResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<NotificationListResponse>(NOTIFICATION_API_ENDPOINTS.notifications, {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, 'Loading notifications...', { useGlobalLoading: false })
}

export const markNotificationsReadEndpoint = async (): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(NOTIFICATION_API_ENDPOINTS.markRead, {
      method: 'PATCH',
      headers: createSessionHeaders(),
    })
  }, 'Marking notifications read...', { useGlobalLoading: false })
}

