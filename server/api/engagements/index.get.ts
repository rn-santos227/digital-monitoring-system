import { defineEventHandler, getQuery } from 'h3'
import type { EngagementListResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEngagementListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEngagementsList } from '../../utils/engagements/fetchEngagementsList'

export default defineEventHandler(async (event): Promise<EngagementListResponse> => {
  await requirePermission(event, PERMISSION_CODES.engagementView)
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ 
    page: query.page,
    pageSize: query.pageSize
  })

  const supabase = getServiceSupabaseClient()
  const { data, count } = await fetchEngagementsList(supabase, { search, rangeFrom, rangeTo })

  const items = data.map(mapEngagementListItem)
  const totalItems = count
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
