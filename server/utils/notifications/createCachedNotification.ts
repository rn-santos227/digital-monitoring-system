import { randomUUID } from 'node:crypto'
import type { AppNotification, CreateNotificationInput } from '../../shared/models'
import { NOTIFICATION_CACHE_MAX_ITEMS, NOTIFICATION_CACHE_TTL_MS } from '../../shared/constants'
import { notifications } from '../../shared/utils'
import { pruneExpiredNotifications } from './pruneExpiredNotifications'

export const createCachedNotification = (input: CreateNotificationInput): AppNotification => {
  pruneExpiredNotifications()

  const now = Date.now()
  const notification: AppNotification = {
    id: randomUUID(),
    type: input.type,
    title: input.title,
    message: input.message,
    sourceId: input.sourceId ?? null,
    sourcePath: input.sourcePath ?? null,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + NOTIFICATION_CACHE_TTL_MS).toISOString(),
    readByUserIds: [],
  }

  notifications.unshift(notification)

  if (notifications.length > NOTIFICATION_CACHE_MAX_ITEMS) {
    notifications.splice(NOTIFICATION_CACHE_MAX_ITEMS)
  }

  return notification
}
