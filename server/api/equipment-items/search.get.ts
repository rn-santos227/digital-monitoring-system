import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentItemListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentItemListItem } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { parseEquipmentItemSearchQuery } from '../../utils/equipment-items/parseEquipmentItemSearchQuery'
import { searchEquipmentItems } from '../../utils/equipment-items/searchEquipmentItems'

export default defineEventHandler(async (event): Promise<EquipmentItemListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)

})
