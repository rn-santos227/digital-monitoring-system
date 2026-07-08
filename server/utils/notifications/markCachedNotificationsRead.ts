import { notifications } from '../../shared/utils'
import { pruneExpiredNotifications } from './pruneExpiredNotifications'

export const markCachedNotificationsRead = (userId: string) => {
  pruneExpiredNotifications()

  notifications.forEach((notification) => {
    if (!notification.readByUserIds.includes(userId)) {
      notification.readByUserIds.push(userId)
    }
  })
}
