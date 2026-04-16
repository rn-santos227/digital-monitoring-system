import type { H3Event } from 'h3'
import { createError } from 'h3'
import { requireAuth } from './requireAuth'

export async function requirePermission(event: H3Event, permissionCode: string) {
  const user = await requireAuth(event)

  if (!user.permission_codes.includes(permissionCode)) {
    throw createError({ statusCode: 403, statusMessage: `Missing required permission: ${permissionCode}` })
  }

  return user
}
