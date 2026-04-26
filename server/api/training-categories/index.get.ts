import { createError, defineEventHandler, getQuery } from 'h3'
import type { TrainingCategoryListResponse } from '../../shared/responses'
import { PERMISSION_CODES, TRAINING_CATEGORY_SELECT_COLUMNS } from '../../shared/constants'
import { mapTrainingCategoryListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<TrainingCategoryListResponse> => {
  await requirePermission(event, PERMISSION_CODES.trainingView)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  let categoryQuery = supabase
    .from('training_categories')
    .select(TRAINING_CATEGORY_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    categoryQuery = categoryQuery.or(`code.ilike.%${search}%,name.ilike.%${search}%`)
  }

  const { data, count, error } = await categoryQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch training categories: ${error.message}` })
  }

  const items = (data ?? []).map(mapTrainingCategoryListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
