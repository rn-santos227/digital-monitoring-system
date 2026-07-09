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

