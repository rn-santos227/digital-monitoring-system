import type { H3Event } from 'h3'
import { createError } from 'h3'
import { requireAuth } from './requireAuth'

export async function requireAnyPermission(event: H3Event, permissionCodes: readonly string[]) {
  const user = await requireAuth(event)

  const hasPermission = permissionCodes.some(permissionCode => user.permission_codes.includes(permissionCode))

  if (!hasPermission) {
    throw createError({
      statusCode: 403,
      statusMessage: `Missing required permission. Expected one of: ${permissionCodes.join(', ')}`,
    })
  }

  return user
}
