import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { TrainingListItem } from '../../../shared/models'
import { TRAINING_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapTrainingListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validation'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getTrainingById } from '../../../utils/trainings/getTrainingById'

export default defineEventHandler(async (event): Promise<TrainingListItem> => {
  await requireAnyPermission(event, TRAINING_PERMISSION_GROUPS.trainingManagement)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Training id is required.')

  const data = await getTrainingById(getServiceSupabaseClient(), id)
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Training not found.' })

  return mapTrainingListItem(data)
})
