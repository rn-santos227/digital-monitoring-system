import { createError, defineEventHandler, getRouterParam } from 'h3'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapEquipmentCategoryListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validation'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getEquipmentCategoryById } from '../../../utils/equipment-categories/getEquipmentCategoryById'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Equipment category id is required.')
  const supabase = getServiceSupabaseClient()
  const row = await getEquipmentCategoryById(supabase, id)

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment category not found.' })
  }

  return mapEquipmentCategoryListItem(row)
})
