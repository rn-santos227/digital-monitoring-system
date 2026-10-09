import type { H3Event } from 'h3'
import type { AuthenticatedUser } from '../../shared/models'
import { PERMISSION_CODES, NOTIFICATION_STREAM_INTERVAL_MS } from '../../shared/constants'
import { getServiceSupabaseClient } from '../auth/serviceClient'
import { ensureTodaysScheduleNotifications } from './ensureTodaysScheduleNotifications'
import { listReadableCachedNotifications } from './listReadableCachedNotifications'

export const streamNotifications = async (event: H3Event, actor: AuthenticatedUser): Promise<void> => {
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

    const items = listReadableCachedNotifications(actor.permission_codes)
      .map(({ readByUserIds, ...notification }) => ({
        ...notification,
        isRead: readByUserIds.includes(actor.id),
      }))

    response.write(`event: notifications\n`)
    response.write(`data: ${JSON.stringify({
      items,
      unreadCount: items.filter(item => !item.isRead).length,
    })}\n\n`)
  }

  const interval = setInterval(() => {
    void sendNotificationSnapshot().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to refresh notifications.'
      response.write(`event: error\n`)
      response.write(`data: ${JSON.stringify({ message })}\n\n`)
    })
  }, NOTIFICATION_STREAM_INTERVAL_MS)

  try {
    await sendNotificationSnapshot()
  } catch (error) {
    isClosed = true
    clearInterval(interval)
    response.end()
    throw error
  }

  return await new Promise<void>((resolve) => {
    event.node.req.on('close', () => {
      isClosed = true
      clearInterval(interval)
      response.end()
      resolve()
    })
  })
}
