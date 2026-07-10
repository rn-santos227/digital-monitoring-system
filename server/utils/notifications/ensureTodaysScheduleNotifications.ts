import type { SupabaseClient } from '@supabase/supabase-js'
import { ENGAGEMENT_SELECT_COLUMNS, TRAINING_SELECT_COLUMNS } from '../../shared/constants'
import type { EngagementRow, TrainingRow } from '../../shared/models'
import { mapEngagementListItem, mapTrainingListItem } from '../../shared/utils'
import { notifications } from '../../shared/utils'
import { notifyEngagementScheduled } from './notifyEngagementScheduled'
import { notifyTrainingScheduled } from './notifyTrainingScheduled'
import { pruneExpiredNotifications } from './pruneExpiredNotifications'

interface EnsureTodaysScheduleNotificationsOptions {
  includeTrainings?: boolean
  includeEngagements?: boolean
}

const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10)

const hasNotificationForToday = (type: 'training-schedule' | 'engagement-schedule', sourceId: string, today: string): boolean => {
  return notifications.some((notification) => {
    return notification.type === type
      && notification.sourceId === sourceId
      && notification.createdAt.startsWith(today)
  })
}

const ensureTodaysTrainingNotifications = async (supabase: SupabaseClient, today: string) => {
  const { data, error } = await supabase
    .from('trainings')
    .select(TRAINING_SELECT_COLUMNS)
    .or(`start_date.eq.${today},end_date.eq.${today}`)

  if (error) {
    throw new Error(`Failed to inspect today's training schedules: ${error.message}`)
  }

  ;((data ?? []) as TrainingRow[])
    .map(mapTrainingListItem)
    .filter(item => !hasNotificationForToday('training-schedule', item.id, today))
    .forEach(notifyTrainingScheduled)
}

const ensureTodaysEngagementNotifications = async (supabase: SupabaseClient, today: string) => {
  const { data, error } = await supabase
    .from('engagements')
    .select(ENGAGEMENT_SELECT_COLUMNS)
    .or(`start_date.eq.${today},end_date.eq.${today}`)

  if (error) {
    throw new Error(`Failed to inspect today's engagement schedules: ${error.message}`)
  }

  ;((data ?? []) as EngagementRow[])
    .map(mapEngagementListItem)
    .filter(item => !hasNotificationForToday('engagement-schedule', item.id, today))
    .forEach(notifyEngagementScheduled)
}


export const ensureTodaysScheduleNotifications = async (
  supabase: SupabaseClient,
  options: EnsureTodaysScheduleNotificationsOptions = {},
  today = toIsoDate(new Date()),
) => {
  pruneExpiredNotifications()
}
