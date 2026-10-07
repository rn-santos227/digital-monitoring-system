import { createError, defineEventHandler, getRouterParam } from 'h3'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapEquipmentItemListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validation'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getEquipmentItemById } from '../../../utils/equipment-items/getEquipmentItemById'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Equipment item id is required.')
  const supabase = getServiceSupabaseClient()
  const equipmentItem = await getEquipmentItemById(supabase, id)

  if (!equipmentItem) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment item not found.' })
  }

  return { item: mapEquipmentItemListItem(equipmentItem) }
})
