import { defineEventHandler } from 'h3'
import { ENGAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import type { EngagementManagementKpiApiResponse } from '../../shared/responses'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEngagementKpiCounts } from '../../utils/engagements/fetchEngagementKpiCounts'

export default defineEventHandler(async (event): Promise<EngagementManagementKpiApiResponse> => {
  await requireAnyPermission(event, ENGAGEMENT_PERMISSION_GROUPS.engagementManagement)
  return await fetchEngagementKpiCounts(getServiceSupabaseClient())
})
