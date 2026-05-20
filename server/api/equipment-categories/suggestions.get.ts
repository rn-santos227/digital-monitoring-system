import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentCategorySuggestionApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import type { EquipmentCategorySuggestionRow } from '../../shared/models'
import { mapEquipmentCategorySuggestionItem, parseEquipmentCategorySuggestionQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentCategorySuggestions } from '../../utils/equipment-categories/fetchEquipmentCategorySuggestions'

export default defineEventHandler(async (event): Promise<EquipmentCategorySuggestionApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)

  const query = getQuery(event)
  const { pageSize, selectedId, term } = parseEquipmentCategorySuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedId: query.selectedId,
  })

  const supabase = getServiceSupabaseClient()
  const rows: EquipmentCategorySuggestionRow[] = await fetchEquipmentCategorySuggestions(supabase, term, pageSize, selectedId)

  return { items: rows.map(mapEquipmentCategorySuggestionItem) }
})
