import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ID_ONLY_SELECT_COLUMNS } from '../../shared/constants'

export async function assertPersonnelSkillTraining(supabase: SupabaseClient, personnelId: string, trainingRecordId: string | null): Promise<void> {
  if (!trainingRecordId) return
  const { data, error } = await supabase.from('training_records')
    .select(ID_ONLY_SELECT_COLUMNS)
    .eq('id', trainingRecordId).eq('personnel_id', personnelId).maybeSingle()
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to validate supporting training: ${error.message}` })
  if (!data) throw createError({ statusCode: 400, statusMessage: 'Supporting training must belong to this personnel.' })
}
