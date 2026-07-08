import { defineEventHandler } from 'h3'
import type { MutationSuccessResponse } from '../../shared/responses'
import { requireAuth } from '../../utils/auth/requireAuth'
import { markCachedNotificationsRead } from '../../utils/notifications/markCachedNotificationsRead'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requireAuth(event)
  markCachedNotificationsRead(actor.id)

  return { ok: true }
})
