import { createError, defineEventHandler, getQuery } from 'h3'
import type { EquipmentIssuanceListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentIssuanceListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchEquipmentIssuances } from '../../utils/equipment-issuances/searchEquipmentIssuances'

export default defineEventHandler(async (event): Promise<EquipmentIssuanceListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const issuedToPersonnelId = typeof query.issuedToPersonnelId === 'string' && query.issuedToPersonnelId ? query.issuedToPersonnelId : null
  const statusId = typeof query.statusId === 'string' && query.statusId ? query.statusId : null

  if (!term && !issuedToPersonnelId && !statusId) {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })
  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await searchEquipmentIssuances(supabase, { term, issuedToPersonnelId, statusId, rangeFrom, rangeTo })

  return { items: rows.map(mapEquipmentIssuanceListItem), page, pageSize, totalItems, totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize) }
})
