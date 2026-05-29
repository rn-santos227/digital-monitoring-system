import { defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { EquipmentItemKpiApiResponse } from '../../shared/responses'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentItemKpiCounts } from '../../utils/equipment-items/fetchEquipmentItemKpiCounts'

export default defineEventHandler(async (event): Promise<EquipmentItemKpiApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  return await fetchEquipmentItemKpiCounts(getServiceSupabaseClient())
})
