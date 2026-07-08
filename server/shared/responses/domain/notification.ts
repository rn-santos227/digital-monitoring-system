import type { AppNotification } from '../../models'

export interface NotificationListItem extends Omit<AppNotification, 'readByUserIds'> {
  isRead: boolean
}

export interface NotificationListResponse {
  items: NotificationListItem[]
  unreadCount: number
}
