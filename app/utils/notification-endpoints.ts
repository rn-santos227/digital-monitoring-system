import { NOTIFICATION_API_ENDPOINTS } from '~/constants/api.constants'
import type { NotificationListResponse } from '~/types/domain/notification'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

interface NotificationStreamHandlers {
  onMessage: (response: NotificationListResponse) => void
  onError?: (error: Error) => void
}

const parseNotificationStreamEvent = (event: string): NotificationListResponse | null => {
  const dataLines = event
    .split('\n')
    .filter(line => line.startsWith('data:'))
    .map(line => line.slice(5).trim())

  if (dataLines.length === 0) {
    return null
  }

  return JSON.parse(dataLines.join('\n')) as NotificationListResponse
}

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

export const openNotificationsStream = (handlers: NotificationStreamHandlers): AbortController => {
  const controller = new AbortController()

  if (!import.meta.client) {
    return controller
  }

  void (async () => {
    const response = await fetch(NOTIFICATION_API_ENDPOINTS.stream, {
      method: 'GET',
      headers: createSessionHeaders(),
      signal: controller.signal,
    })

    if (!response.ok || !response.body) {
      throw new Error('Unable to open notification stream.')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (!controller.signal.aborted) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split('\n\n')
      buffer = events.pop() ?? ''

      events.forEach((event) => {
        if (!event.includes('event: notifications')) {
          return
        }

        const payload = parseNotificationStreamEvent(event)
        if (payload) {
          handlers.onMessage(payload)
        }
      })
    }
  })().catch((error: unknown) => {
    if (controller.signal.aborted) {
      return
    }

    const streamError = error instanceof Error ? error : new Error('Notification stream failed.')
    handlers.onError?.(streamError)
  })

  return controller
}
