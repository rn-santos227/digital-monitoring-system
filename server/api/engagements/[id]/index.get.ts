import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { EngagementListItem } from '../../../shared/models'
import { ENGAGEMENT_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapEngagementListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validation'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getEngagementById } from '../../../utils/engagements/getEngagementById'

export default defineEventHandler(async (event): Promise<EngagementListItem> => {
  await requireAnyPermission(event, ENGAGEMENT_PERMISSION_GROUPS.engagementManagement)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Engagement id is required.')

  const data = await getEngagementById(getServiceSupabaseClient(), id)
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Engagement not found.' })

  return mapEngagementListItem(data)
})
