import { defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import { requireAuth } from '../../utils/auth/requireAuth'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { ensureTodaysScheduleNotifications } from '../../utils/notifications/ensureTodaysScheduleNotifications'
import { listReadableCachedNotifications } from '../../utils/notifications/listReadableCachedNotifications'

const NOTIFICATION_STREAM_INTERVAL_MS = 30000

export default defineEventHandler(async (event) => {

})
