import { createError, defineEventHandler, getRouterParam } from 'h3'
import { TRAINING_CATEGORY_SELECT_COLUMNS, TRAINING_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapTrainingCategoryListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event) => {
  await requireAnyPermission(event, TRAINING_PERMISSION_GROUPS.trainingManagement)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Training category id is required.')
  const supabase = getServiceSupabaseClient()
  const { data, error } = await supabase
    .from('training_categories')
    .select(TRAINING_CATEGORY_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch training category details: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Training category not found.' })
  }

  return mapTrainingCategoryListItem(data)
})
