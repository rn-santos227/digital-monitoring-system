import { createError, defineEventHandler, getQuery } from 'h3'
import type { EngagementRecordListResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEngagementRecordListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
const REQUIRED_PERMISSION_CODE = PERMISSION_CODES.engagementManage

import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchEngagementRecords } from '../../utils/engagement-records/searchEngagementRecords'

export default defineEventHandler(async (event): Promise<EngagementRecordListResponse> => {
  await requirePermission(event, REQUIRED_PERMISSION_CODE)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const engagementId = typeof query.engagementId === 'string' && query.engagementId.length > 0 ? query.engagementId : null
  const personnelId = typeof query.personnelId === 'string' && query.personnelId.length > 0 ? query.personnelId : null
  const engagementTypeId = typeof query.engagementTypeId === 'string' && query.engagementTypeId.length > 0 ? query.engagementTypeId : null
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0 ? query.statusId : null

  if (!term && !engagementId && !personnelId && !engagementTypeId && !statusId) {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })
  const fields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []

  const { rows, totalItems } = await searchEngagementRecords(getServiceSupabaseClient(), {
    term,
    fields,
    engagementId,
    personnelId,
    engagementTypeId,
    statusId,
    rangeFrom,
    rangeTo,
  })

  const response: EngagementRecordListResponse = {
    items: rows.map(mapEngagementRecordListItem),
    page,
    pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
  }

  return response
})
