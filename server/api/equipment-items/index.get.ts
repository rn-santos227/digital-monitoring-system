import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentItemListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentItemListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentItemsList } from '../../utils/equipment-items/fetchEquipmentItemsList'

export default defineEventHandler(async (event): Promise<EquipmentItemListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await fetchEquipmentItemsList(supabase, { search, rangeFrom, rangeTo })

  return {
    items: rows.map(mapEquipmentItemListItem),
    page,
    pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
  }
})
