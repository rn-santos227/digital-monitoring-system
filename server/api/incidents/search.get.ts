import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentIncidentListResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentIncidentListItem } from '../../shared/utils'
import { parseEquipmentIncidentListQuery } from '../../shared/validations'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentIncidentsList } from '../../utils/incidents/fetchEquipmentIncidentsList'

export default defineEventHandler(async (event): Promise<EquipmentIncidentListResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const filters = parseEquipmentIncidentListQuery(getQuery(event))

})
