import { createError, defineEventHandler, getQuery } from 'h3'
import type { EngagementListResponse } from '../../shared/responses'
import { ENGAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapEngagementListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchEngagements } from '../../utils/engagements/searchEngagements'

const SEARCHABLE_FIELDS = { engagementTitle: 'engagement_title', defaultRemarks: 'default_remarks' } as const

export default defineEventHandler(async (event): Promise<EngagementListResponse> => {
  await requireAnyPermission(event, ENGAGEMENT_PERMISSION_GROUPS.engagementManagement)
  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
 
  const engagementCategoryId = typeof query.engagementCategoryId === 'string' && query.engagementCategoryId.length > 0 ? query.engagementCategoryId : null
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0 ? query.statusId : null
  if (!term && !engagementCategoryId && !statusId) throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required.' })
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })
  const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map((field) => field.trim()) : []
  const selectedFields = rawFields.length > 0 ? rawFields.filter((field): field is keyof typeof SEARCHABLE_FIELDS => field in SEARCHABLE_FIELDS) : Object.keys(SEARCHABLE_FIELDS) as Array<keyof typeof SEARCHABLE_FIELDS>
  const filters = term ? selectedFields.map((field) => `${SEARCHABLE_FIELDS[field]}.ilike.%${term}%`) : []
  if (term && filters.length === 0) throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  
  const { data, count } = await searchEngagements(getServiceSupabaseClient(), { filters, engagementCategoryId, statusId, rangeFrom, rangeTo })
  const items = data.map(mapEngagementListItem)
  
  const totalItems = count
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
