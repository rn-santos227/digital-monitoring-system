import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentAssetListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentAssetsList } from '../../utils/equipment-assets/fetchEquipmentAssetsList'
import { mapEquipmentAssetListItem } from '../../shared/utils/equipment-management'

export default defineEventHandler(async (event): Promise<EquipmentAssetListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })
  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await fetchEquipmentAssetsList(supabase, search, rangeFrom, rangeTo)

  return { items: rows.map(mapEquipmentAssetListItem), page, pageSize, totalItems, totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize) }
})
