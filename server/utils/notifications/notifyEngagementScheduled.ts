import type { EngagementListItem } from '../../shared/models'
import { formatNotificationDateRange, isScheduledNotificationStatus } from '../../shared/utils'
import { createCachedNotification } from './createCachedNotification'

export const notifyEngagementScheduled = (item: EngagementListItem) => {
  if (!isScheduledNotificationStatus(item.statusName)) {
    return
  }

  createCachedNotification({
    type: 'engagement-schedule',
    title: 'Engagement on schedule',
    message: `${item.engagementTitle} is scheduled for ${formatNotificationDateRange(item.startDate, item.endDate)}.`,
    sourceId: item.id,
    sourcePath: '/engagement-records?tab=calendar',
  })
}
