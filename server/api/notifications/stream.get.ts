import { defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import { requireAuth } from '../../utils/auth/requireAuth'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { ensureTodaysScheduleNotifications } from '../../utils/notifications/ensureTodaysScheduleNotifications'
import { listReadableCachedNotifications } from '../../utils/notifications/listReadableCachedNotifications'

const NOTIFICATION_STREAM_INTERVAL_MS = 30000

export default defineEventHandler(async (event) => {
  const actor = await requireAuth(event)

  const response = event.node.res
  response.writeHead(200, {
    'cache-control': 'no-cache, no-transform',
    connection: 'keep-alive',
    'content-type': 'text/event-stream',
    'x-accel-buffering': 'no',
  })

  const supabase = getServiceSupabaseClient()
  let isClosed = false


  const sendNotificationSnapshot = async () => {
    if (isClosed) {
      return
    }

    await ensureTodaysScheduleNotifications(supabase, {
      includeTrainings: actor.permission_codes.includes(PERMISSION_CODES.trainingView),
      includeEngagements: actor.permission_codes.includes(PERMISSION_CODES.engagementView),
    })
  }
})
