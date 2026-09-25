import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentIncidentListResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentIncidentListItem } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { parseEquipmentIncidentSearchQuery } from '../../utils/incidents/parseEquipmentIncidentSearchQuery'
import { searchEquipmentIncidents } from '../../utils/incidents/searchEquipmentIncidents'

export default defineEventHandler(async (event): Promise<EquipmentIncidentListResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const { page, pageSize, ...searchOptions } = parseEquipmentIncidentSearchQuery(getQuery(event))
  const { rows, totalItems } = await searchEquipmentIncidents(
    getServiceSupabaseClient(),
    searchOptions,
  )

  return {
    items: rows.map(mapEquipmentIncidentListItem),
    page,
    pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
  }
})
