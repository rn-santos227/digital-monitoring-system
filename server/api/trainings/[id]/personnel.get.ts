import { defineEventHandler, getRouterParam } from 'h3'
import type { TrainingPersonnelListResponse } from '../../../shared/responses'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapUnitPersonnelListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validation'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchTrainingPersonnelByTrainingId } from '../../../utils/trainings/fetchTrainingPersonnelByTrainingId'

export default defineEventHandler(async (event): Promise<TrainingPersonnelListResponse> => {
  await requirePermission(event, PERMISSION_CODES.trainingManage)

  const trainingId = requireRouteId(getRouterParam(event, 'id'), 'Training id is required.')
  const supabase = getServiceSupabaseClient()
  const rows = await fetchTrainingPersonnelByTrainingId(supabase, trainingId)
  const items = rows.map(mapUnitPersonnelListItem)

  return {
    items,
    page: 1,
    pageSize: items.length,
    totalItems: items.length,
    totalPages: items.length === 0 ? 0 : 1,
  }
})
