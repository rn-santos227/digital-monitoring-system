import { createError, defineEventHandler, getRouterParam } from 'h3'
import { PERMISSION_CODES } from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getEquipmentAssetById } from '../../../utils/equipment-assets/getEquipmentAssetById'
import { mapEquipmentAssetListItem } from '../../../shared/utils/equipment-management'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Equipment asset id is required.')
  const supabase = getServiceSupabaseClient()
  const row = await getEquipmentAssetById(supabase, id)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Equipment asset not found.' })
  return { item: mapEquipmentAssetListItem(row) }
})
