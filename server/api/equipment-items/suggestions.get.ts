import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentItemSuggestionApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import type { EquipmentItemSuggestionRow } from '../../shared/models'
import { mapEquipmentItemSuggestionItem, parseEquipmentItemSuggestionQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentItemSuggestions } from '../../utils/equipment-items/fetchEquipmentItemSuggestions'

export default defineEventHandler(async (event): Promise<EquipmentItemSuggestionApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const query = getQuery(event)
  const { pageSize, selectedId, term } = parseEquipmentItemSuggestionQuery({ term: query.term, pageSize: query.pageSize, selectedId: query.selectedId })
  const supabase = getServiceSupabaseClient()
  const rows: EquipmentItemSuggestionRow[] = await fetchEquipmentItemSuggestions(supabase, term, pageSize, selectedId)
  return { items: rows.map(mapEquipmentItemSuggestionItem) }
})
