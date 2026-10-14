import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_HISTORY_CONFIG } from '../../shared/constants'
import type { PersonnelHistoryKind, PersonnelHistoryRow, PersonnelHistoryWrite } from '../../shared/models'
import { mapPersonnelHistoryItem } from '../../shared/utils'

export async function writePersonnelHistoryRecord(
  supabase: SupabaseClient,
  kind: PersonnelHistoryKind,
  personnelId: string,
  payload: PersonnelHistoryWrite,
  userId: string,
  recordId: string | null,
) {
  const config = PERSONNEL_HISTORY_CONFIG[kind]
  const query = recordId
    ? supabase.from(config.table).update(payload).eq('personnel_id', personnelId).eq('id', recordId)
    : supabase.from(config.table).insert({ ...payload, personnel_id: personnelId, created_by: userId })
  const { data, error } = await query.select(config.selectColumns).maybeSingle<PersonnelHistoryRow>()
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to save personnel ${kind}: ${error.message}` })
  if (!data) throw createError({ statusCode: recordId ? 404 : 500, statusMessage: 'Personnel history record could not be saved.' })
  return mapPersonnelHistoryItem(data, kind)
}
