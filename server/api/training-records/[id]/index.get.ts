import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { TrainingRecordDetailResponse } from '../../../shared/responses'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapTrainingRecordListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getTrainingRecordById } from '../../../utils/training-records/getTrainingRecordById'

export default defineEventHandler(async (event): Promise<TrainingRecordDetailResponse> => {
  await requirePermission(event, PERMISSION_CODES.trainingManage)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Training record id is required.')
  const trainingRecord = await getTrainingRecordById(getServiceSupabaseClient(), id)

  if (!trainingRecord) throw createError({ statusCode: 404, statusMessage: 'Training record not found.' })
  return mapTrainingRecordListItem(trainingRecord)
})
