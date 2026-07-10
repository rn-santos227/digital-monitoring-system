import { defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { NotificationListResponse } from '../../shared/responses'
import { requireAuth } from '../../utils/auth/requireAuth'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { ensureTodaysScheduleNotifications } from '../../utils/notifications/ensureTodaysScheduleNotifications'
import { listReadableCachedNotifications } from '../../utils/notifications/listReadableCachedNotifications'

export default defineEventHandler(async (event): Promise<NotificationListResponse> => {
  const actor = await requireAuth(event)
  const supabase = getServiceSupabaseClient()
  await ensureTodaysScheduleNotifications(supabase, {
    includeTrainings: actor.permission_codes.includes(PERMISSION_CODES.trainingView),
    includeEngagements: actor.permission_codes.includes(PERMISSION_CODES.engagementView),
  })
  const notifications = listReadableCachedNotifications(actor.permission_codes)

  const items = notifications.map(({ readByUserIds, ...notification }) => ({
    ...notification,
    isRead: readByUserIds.includes(actor.id),
  }))

  return {
    items,
    unreadCount: items.filter(item => !item.isRead).length,
  }
})
