import { defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { EquipmentCategoryKpiApiResponse } from '../../shared/responses'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentCategoryKpiCounts } from '../../utils/equipment-categories/fetchEquipmentCategoryKpiCounts'

export default defineEventHandler(async (event): Promise<EquipmentCategoryKpiApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  return await fetchEquipmentCategoryKpiCounts(getServiceSupabaseClient())
})
