import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentIssuanceListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentIssuanceListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentIssuancesList } from '../../utils/equipment-issuances/fetchEquipmentIssuancesList'

export default defineEventHandler(async (event): Promise<EquipmentIssuanceListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await fetchEquipmentIssuancesList(supabase, { search, rangeFrom, rangeTo })
  const items = rows.map(mapEquipmentIssuanceListItem)

  return { items, page, pageSize, totalItems, totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize) }
})
