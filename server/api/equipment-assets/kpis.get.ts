import { defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { EquipmentAssetKpiApiResponse } from '../../shared/responses'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentAssetKpiCounts } from '../../utils/equipment-assets/fetchEquipmentAssetKpiCounts'

export default defineEventHandler(async (event): Promise<EquipmentAssetKpiApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  return await fetchEquipmentAssetKpiCounts(getServiceSupabaseClient())
})
