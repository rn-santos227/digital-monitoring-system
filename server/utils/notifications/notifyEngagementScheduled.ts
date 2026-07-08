import type { EngagementListItem } from '../../shared/models'
import { formatNotificationDateRange, isScheduledNotificationStatus } from '../../shared/utils'
import { createCachedNotification } from './createCachedNotification'

export const notifyEngagementScheduled = (item: EngagementListItem) => {
  if (!isScheduledNotificationStatus(item.statusName)) {
    return
  }

}
