import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentIssuanceListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentIssuanceListItem } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { parseEquipmentIssuanceSearchQuery } from '../../utils/equipment-issuances/parseEquipmentIssuanceSearchQuery'
import { searchEquipmentIssuances } from '../../utils/equipment-issuances/searchEquipmentIssuances'

export default defineEventHandler(async (event): Promise<EquipmentIssuanceListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const { page, pageSize, ...searchOptions } = parseEquipmentIssuanceSearchQuery(getQuery(event))
  const { rows, totalItems } = await searchEquipmentIssuances(getServiceSupabaseClient(), searchOptions)

  return { items: rows.map(mapEquipmentIssuanceListItem), page, pageSize, totalItems, totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize) }
})
