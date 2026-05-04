import { defineEventHandler, getQuery } from 'h3'
import type { TrainingCategoryListResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapTrainingCategoryListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchTrainingCategoriesList } from '../../utils/training-categories/fetchTrainingCategoriesList'

export default defineEventHandler(async (event): Promise<TrainingCategoryListResponse> => {
  await requirePermission(event, PERMISSION_CODES.trainingView)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await fetchTrainingCategoriesList(supabase, {
    search,
    rangeFrom,
    rangeTo,
  })

  const items = rows.map(mapTrainingCategoryListItem)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
