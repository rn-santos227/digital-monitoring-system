import { defineEventHandler, getQuery } from 'h3'
import type { TrainingListResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapTrainingListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchTrainingsList } from '../../utils/trainings/fetchTrainingsList'

export default defineEventHandler(async (event): Promise<TrainingListResponse> => {
  await requirePermission(event, PERMISSION_CODES.trainingView)
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ 
    page: query.page,
    pageSize: query.pageSize
  })

  const supabase = getServiceSupabaseClient()
  const { data, count } = await fetchTrainingsList(supabase, { search, rangeFrom, rangeTo })

  const items = data.map(mapTrainingListItem)
  const totalItems = count
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
