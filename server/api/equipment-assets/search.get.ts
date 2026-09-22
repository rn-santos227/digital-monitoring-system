import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentAssetListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentAssetListItem } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { parseEquipmentAssetSearchQuery } from '../../utils/equipment-assets/parseEquipmentAssetSearchQuery'
import { searchEquipmentAssets } from '../../utils/equipment-assets/searchEquipmentAssets'

export default defineEventHandler(async (event): Promise<EquipmentAssetListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const { page, pageSize, ...searchOptions } = parseEquipmentAssetSearchQuery(getQuery(event))
  const { rows, totalItems } = await searchEquipmentAssets(getServiceSupabaseClient(), searchOptions)

  return {
    items: rows.map(mapEquipmentAssetListItem),
    page,
    pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
  }
})
