import { defineEventHandler, getQuery } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { EngagementRecordListResponse } from '../../shared/responses'
import { mapEngagementRecordListItem } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { parseEngagementRecordSearchQuery } from '../../utils/engagement-records/parseEngagementRecordSearchQuery'
import { searchEngagementRecords } from '../../utils/engagement-records/searchEngagementRecords'

export default defineEventHandler(async (event): Promise<EngagementRecordListResponse> => {
  await requirePermission(event, PERMISSION_CODES.engagementManage)

  const { page, pageSize, ...searchParams } = parseEngagementRecordSearchQuery(getQuery(event))
  const { rows, totalItems } = await searchEngagementRecords(getServiceSupabaseClient(), searchParams)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return {
    items: rows.map(mapEngagementRecordListItem),
    page,
    pageSize,
    totalItems,
    totalPages,
  }
})
