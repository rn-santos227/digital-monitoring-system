import type { SupabaseClient } from '@supabase/supabase-js'
import { fetchPersonnelSuggestions } from './fetchPersonnelSuggestions'
import { getPersonnelSuggestionById } from './getPersonnelSuggestionById'
import { getPersonnelSuggestionByServiceNumber } from './getPersonnelSuggestionByServiceNumber'

export const resolvePersonnelSuggestionRows = async (
  supabase: SupabaseClient,
  pageSize: number,
  selectedPersonnelId: string | null,
  term: string,
  filters?: string,
) => {
  const { data: personnelRows, error: personnelError } = await fetchPersonnelSuggestions(supabase, pageSize, filters)

  if (personnelError) {
    return { rows: [], error: personnelError }
  }

  const mergedRows = [...(personnelRows ?? [])]

  if (term.length > 0 && !mergedRows.some(row => row.service_number === term)) {
    const { data: serviceNumberRow, error: serviceNumberError } = await getPersonnelSuggestionByServiceNumber(supabase, term)

    if (serviceNumberError) {
      return { rows: [], error: serviceNumberError }
    }

    if (serviceNumberRow && !mergedRows.some(row => row.id === serviceNumberRow.id)) {
      mergedRows.unshift(serviceNumberRow)
    }
  }

  if (selectedPersonnelId && !mergedRows.some(row => row.id === selectedPersonnelId)) {
    const { data: selectedRow, error: selectedRowError } = await getPersonnelSuggestionById(supabase, selectedPersonnelId)

    if (selectedRowError) {
      return { rows: [], error: selectedRowError }
    }

    if (selectedRow) {
      mergedRows.unshift(selectedRow)
    }
  }

  return { rows: mergedRows, error: null }
}
