import { createError, defineEventHandler, getRouterParam } from 'h3'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapEquipmentIssuanceListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getEquipmentIssuanceById } from '../../../utils/equipment-issuances/getEquipmentIssuanceById'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Equipment issuance id is required.')
  const supabase = getServiceSupabaseClient()
  const row = await getEquipmentIssuanceById(supabase, id)

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment issuance not found.' })
  }

  return { item: mapEquipmentIssuanceListItem(row) }
})
