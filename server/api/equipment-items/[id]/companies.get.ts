import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { EquipmentItemCompanyUsageListApiResponse } from '../../../shared/responses'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapEquipmentItemCompanyUsageListItems, parseManagementPaginationQuery } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchEquipmentItemUsageRows } from '../../../utils/equipment-items/fetchEquipmentItemUsageRows'
import { getEquipmentItemById } from '../../../utils/equipment-items/getEquipmentItemById'

export default defineEventHandler(async (event): Promise<EquipmentItemCompanyUsageListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)

  const equipmentItemId = requireRouteId(getRouterParam(event, 'id'), 'Equipment item id is required.')
  const query = getQuery(event)
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const equipmentItem = await getEquipmentItemById(supabase, equipmentItemId)

  if (!equipmentItem) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment item not found.' })
  }

  const rows = await fetchEquipmentItemUsageRows(supabase, equipmentItemId)
  const groupedItems = mapEquipmentItemCompanyUsageListItems(rows)
  const totalItems = groupedItems.length
  const items = groupedItems.slice(rangeFrom, rangeTo + 1)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
