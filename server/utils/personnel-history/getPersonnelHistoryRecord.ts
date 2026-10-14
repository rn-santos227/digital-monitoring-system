import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_HISTORY_CONFIG } from '../../shared/constants'
import type { PersonnelHistoryKind, PersonnelHistoryRow } from '../../shared/models'
import { mapPersonnelHistoryItem } from '../../shared/utils'

export async function getPersonnelHistoryRecord(supabase: SupabaseClient, kind: PersonnelHistoryKind, personnelId: string, recordId: string) {
  const config = PERSONNEL_HISTORY_CONFIG[kind]
  const { data, error } = await supabase.from(config.table).select(config.selectColumns)
    .eq('personnel_id', personnelId).eq('id', recordId).maybeSingle<PersonnelHistoryRow>()
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to load personnel ${kind} record: ${error.message}` })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Personnel history record not found.' })
  return mapPersonnelHistoryItem(data, kind)
}
