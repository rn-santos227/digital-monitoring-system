import { createError, defineEventHandler, getQuery } from 'h3'
import type { RankListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES, RANK_LIST_SELECT_COLUMNS } from '../../shared/constants'
import { mapRankListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<RankListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.personnelView)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  let rankQuery = supabase
    .from('ranks')
    .select(RANK_LIST_SELECT_COLUMNS, { count: 'exact' })
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    rankQuery = rankQuery.or(`code.ilike.%${search}%,name.ilike.%${search}%`)
  }

  const { data, count, error } = await rankQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch ranks: ${error.message}` })
  }

  const items = (data ?? []).map(mapRankListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
