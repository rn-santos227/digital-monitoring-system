import type { H3Event } from 'h3'
import { requireAnyPermission } from '../auth/requireAnyPermission'

export const requireBulkPermission = (
  event: H3Event,
  permissionCodes: readonly string[],
) => requireAnyPermission(event, permissionCodes)
