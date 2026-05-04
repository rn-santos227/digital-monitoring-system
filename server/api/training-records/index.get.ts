import { defineEventHandler, getQuery } from 'h3'
import type { TrainingRecordListResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapTrainingRecordListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchTrainingRecordsList } from '../../utils/training-records/fetchTrainingRecordsList'

export default defineEventHandler(async (event): Promise<TrainingRecordListResponse> => {
  await requirePermission(event, PERMISSION_CODES.trainingManage)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await fetchTrainingRecordsList(supabase, { search, rangeFrom, rangeTo })

  const response: TrainingRecordListResponse = {
    items: rows.map(mapTrainingRecordListItem),
    page,
    pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
  }

  return response
})
