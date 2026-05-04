import { createError, defineEventHandler, getRouterParam } from 'h3'
import { TRAINING_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapTrainingCategoryListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getTrainingCategoryById } from '../../../utils/training-categories/getTrainingCategoryById'

export default defineEventHandler(async (event) => {
  await requireAnyPermission(event, TRAINING_PERMISSION_GROUPS.trainingManagement)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Training category id is required.')
  const supabase = getServiceSupabaseClient()
  const row = await getTrainingCategoryById(supabase, id)

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Training category not found.' })
  }

  return mapTrainingCategoryListItem(row)
})
