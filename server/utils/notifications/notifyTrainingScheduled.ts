import type { TrainingListItem } from '../../shared/models'
import { formatNotificationDateRange, isScheduledNotificationStatus } from '../../shared/utils'
import { createCachedNotification } from './createCachedNotification'

export const notifyTrainingScheduled = (item: TrainingListItem) => {
  if (!isScheduledNotificationStatus(item.statusName)) {
    return
  }

  createCachedNotification({
    type: 'training-schedule',
    title: 'Training on schedule',
    message: `${item.trainingTitle} is scheduled for ${formatNotificationDateRange(item.startDate, item.endDate)}.`,
    sourceId: item.id,
    sourcePath: '/training-records?tab=calendar',
  })
}
