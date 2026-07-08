import { notifications } from '../../shared/utils'

export const pruneExpiredNotifications = () => {
  const now = Date.now()

  for (let index = notifications.length - 1; index >= 0; index -= 1) {
    const notification = notifications[index]
    if (!notification || new Date(notification.expiresAt).getTime() > now) {
      continue
    }

    notifications.splice(index, 1)
  }
}
