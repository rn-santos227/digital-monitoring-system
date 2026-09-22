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
  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  if (!term) throw createError({ statusCode: 400, statusMessage: 'Search term is required.' })
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })
  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await fetchEquipmentAssetsList(supabase, term, rangeFrom, rangeTo)
  return { items: rows.map(mapEquipmentAssetListItem), page, pageSize, totalItems, totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize) }
})
