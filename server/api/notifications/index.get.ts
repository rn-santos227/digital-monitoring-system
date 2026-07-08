import { defineEventHandler } from 'h3'
import type { NotificationListResponse } from '../../shared/responses'
import { requireAuth } from '../../utils/auth/requireAuth'
import { listCachedNotifications } from '../../utils/notifications/listCachedNotifications'

export default defineEventHandler(async (event): Promise<NotificationListResponse> => {
  const actor = await requireAuth(event)
  const notifications = listCachedNotifications()
  const items = notifications.map(({ readByUserIds, ...notification }) => ({
    ...notification,
    isRead: readByUserIds.includes(actor.id),
  }))

  return {
    items,
    unreadCount: items.filter(item => !item.isRead).length,
  }
})
