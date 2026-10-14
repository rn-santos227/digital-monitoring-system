import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ID_ONLY_SELECT_COLUMNS, PERSONNEL_HISTORY_CONFIG } from '../../shared/constants'
import type { PersonnelHistoryKind } from '../../shared/models'

export async function deletePersonnelHistoryRecord(supabase: SupabaseClient, kind: PersonnelHistoryKind, personnelId: string, recordId: string): Promise<void> {
  const { data, error } = await supabase.from(PERSONNEL_HISTORY_CONFIG[kind].table)
    .delete().eq('personnel_id', personnelId).eq('id', recordId).select(ID_ONLY_SELECT_COLUMNS).maybeSingle()
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to remove personnel ${kind}: ${error.message}` })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Personnel history record not found.' })
}
