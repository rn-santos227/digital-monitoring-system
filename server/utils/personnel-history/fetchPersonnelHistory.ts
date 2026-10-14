import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_HISTORY_CONFIG } from '../../shared/constants'
import type { PersonnelHistoryKind, PersonnelHistoryRow } from '../../shared/models'
import { mapPersonnelHistoryItem } from '../../shared/utils'

export async function fetchPersonnelHistory(supabase: SupabaseClient, kind: PersonnelHistoryKind, personnelId: string, rangeFrom: number, rangeTo: number) {
  const config = PERSONNEL_HISTORY_CONFIG[kind]
  const { data, error, count } = await supabase.from(config.table)
    .select(config.selectColumns, { count: 'exact' }).eq('personnel_id', personnelId)
    .order('created_at', { ascending: false }).order('id', { ascending: false }).range(rangeFrom, rangeTo)
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to load personnel ${kind}: ${error.message}` })
  return { items: ((data ?? []) as PersonnelHistoryRow[]).map((row) => mapPersonnelHistoryItem(row, kind)), totalItems: count ?? 0 }
}
