import { defineEventHandler, getQuery } from 'h3'
import type { EngagementRecordListResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEngagementRecordListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
const REQUIRED_PERMISSION_CODE = PERMISSION_CODES.engagementManage

import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEngagementRecordsList } from '../../utils/engagement-records/fetchEngagementRecordsList'

export default defineEventHandler(async (event): Promise<EngagementRecordListResponse> => {
  await requirePermission(event, REQUIRED_PERMISSION_CODE)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await fetchEngagementRecordsList(supabase, { search, rangeFrom, rangeTo })

  const response: EngagementRecordListResponse = {
    items: rows.map(mapEngagementRecordListItem),
    page,
    pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
  }

  return response
})
