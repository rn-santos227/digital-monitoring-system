import { defineEventHandler, getQuery } from 'h3'
import { ENGAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import type { EngagementListResponse } from '../../shared/responses'
import { mapEngagementListItem } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { parseEngagementSearchQuery } from '../../utils/engagements/parseEngagementSearchQuery'
import { searchEngagements } from '../../utils/engagements/searchEngagements'

export default defineEventHandler(async (event): Promise<EngagementListResponse> => {
  await requireAnyPermission(event, ENGAGEMENT_PERMISSION_GROUPS.engagementManagement)

  const { page, pageSize, ...searchParams } = parseEngagementSearchQuery(getQuery(event))
  const { data, count } = await searchEngagements(getServiceSupabaseClient(), searchParams)
  const totalPages = count === 0 ? 0 : Math.ceil(count / pageSize)

  return {
    items: data.map(mapEngagementListItem),
    page,
    pageSize,
    totalItems: count,
    totalPages,
  }
})
