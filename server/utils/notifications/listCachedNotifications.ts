import { notifications } from '../../shared/utils'
import { pruneExpiredNotifications } from './pruneExpiredNotifications'

export const listCachedNotifications = () => {
  pruneExpiredNotifications()

  return notifications.map(notification => ({
    ...notification,
    readByUserIds: [...notification.readByUserIds],
  }))
}
