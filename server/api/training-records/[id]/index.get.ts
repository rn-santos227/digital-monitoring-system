import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { TrainingRecordDetailResponse } from '../../../shared/responses'
import { PERMISSION_CODES, TRAINING_RECORD_SELECT_COLUMNS } from '../../../shared/constants'
import { mapTrainingRecordListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<TrainingRecordDetailResponse> => {
  await requirePermission(event, PERMISSION_CODES.trainingManage)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Training record id is required.')
  const supabase = getServiceSupabaseClient()
  const { data, error } = await supabase
    .from('training_records')
    .select(TRAINING_RECORD_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch training record details: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Training record not found.' })
  }

  return mapTrainingRecordListItem(data)
})
