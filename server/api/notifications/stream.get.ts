import { defineEventHandler } from 'h3'
import { requireAuth } from '../../utils/auth/requireAuth'
import { streamNotifications } from '../../utils/notifications/streamNotifications'

export default defineEventHandler(async (event) => {
  const actor = await requireAuth(event)
  return await streamNotifications(event, actor)
})
