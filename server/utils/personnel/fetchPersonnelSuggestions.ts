import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'

export const fetchPersonnelSuggestions = async (
  supabase: SupabaseClient,
  pageSize: number,
  filter: string | undefined,
  selectedPersonnelId: string | null,
  term: string,
  excludeCompanyId: string | null,
  excludeBattalionId: string | null,
) => {
  let query = supabase
    .from('vw_personnel_profile')
    .select(PERSONNEL_PROFILE_LIST_SELECT_COLUMNS)
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })

  const filters: string[] = []

  if (filter) {
    filters.push(filter)
  }

  if (term.length > 0) {
    filters.push(`service_number.eq.${term}`)
  }

  if (selectedPersonnelId) {
    filters.push(`id.eq.${selectedPersonnelId}`)
  }

  if (filters.length > 0) {
    query = query.or(filters.join(','))
  }

  if (excludeCompanyId) {
    query = query.neq('company_id', excludeCompanyId)
  }

  if (excludeBattalionId) {
    query = query.neq('battalion_id', excludeBattalionId)
  }

  const limit =
    pageSize + (selectedPersonnelId ? 1 : 0) + (term.length > 0 ? 1 : 0)
  const { data, error } = await query.limit(limit)

  const rows = data ?? []
  const selectedRow = selectedPersonnelId
    ? rows.find((row) => row.id === selectedPersonnelId)
    : undefined
  const serviceNumberRow =
    term.length > 0
      ? rows.find((row) => row.service_number === term)
      : undefined

  const dedupedRows = rows.filter(
    (row) => row.id !== selectedPersonnelId && row.service_number !== term,
  )
  const prioritizedRows = Array.from(
    new Map(
      [selectedRow, serviceNumberRow]
        .filter((row): row is NonNullable<typeof row> => Boolean(row))
        .map((row) => [row.id, row]),
    ).values(),
  )
  const normalizedRows = [...prioritizedRows, ...dedupedRows].slice(
    0,
    pageSize + prioritizedRows.length,
  )

  return { data: normalizedRows, error }
}
