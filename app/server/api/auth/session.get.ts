import { defineEventHandler } from 'h3'
import { requireAuth } from '../../utils/auth/requireAuth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  return { ok: true, user }
})
