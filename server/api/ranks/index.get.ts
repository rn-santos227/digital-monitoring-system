import { defineEventHandler, getQuery } from 'h3'
import type { RankListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapRankListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchRanksList } from '../../utils/ranks/fetchRanksList'

export default defineEventHandler(async (event): Promise<RankListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.personnelView)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const result = await fetchRanksList(supabase, {
    search,
    rangeFrom,
    rangeTo,
  })

  const items = result.data.map(mapRankListItem)
  const totalItems = result.count
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
