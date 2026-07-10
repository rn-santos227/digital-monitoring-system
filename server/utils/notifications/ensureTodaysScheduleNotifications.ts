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

}
