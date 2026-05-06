import { defineEventHandler, getRouterParam } from 'h3'
import type { EngagementPersonnelListResponse } from '../../../shared/responses'
import { ENGAGEMENT_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapUnitPersonnelListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchEngagementPersonnelByEngagementId } from '../../../utils/engagements/fetchEngagementPersonnelByEngagementId'

export default defineEventHandler(async (event): Promise<EngagementPersonnelListResponse> => {
  await requireAnyPermission(event, ENGAGEMENT_PERMISSION_GROUPS.engagementManagement)

  const engagementId = requireRouteId(getRouterParam(event, 'id'), 'Engagement id is required.')
  const supabase = getServiceSupabaseClient()
  const rows = await fetchEngagementPersonnelByEngagementId(supabase, engagementId)
  const items = rows.map(mapUnitPersonnelListItem)

  return {
    items,
    page: 1,
    pageSize: items.length,
    totalItems: items.length,
    totalPages: items.length === 0 ? 0 : 1,
  }
})
