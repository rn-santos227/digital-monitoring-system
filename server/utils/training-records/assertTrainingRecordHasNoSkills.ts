import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ID_ONLY_SELECT_COLUMNS } from '../../shared/constants'

export async function assertTrainingRecordHasNoSkills(supabase: SupabaseClient, trainingRecordId: string): Promise<void> {
  const { count, error } = await supabase.from('personnel_qualifications')
    .select(ID_ONLY_SELECT_COLUMNS, { count: 'exact', head: true })
    .eq('training_record_id', trainingRecordId)
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to check supporting skill references: ${error.message}` })
  if ((count ?? 0) > 0) {
    throw createError({ statusCode: 409, statusMessage: 'This training record supports personnel skills. Update or remove those skill references before deleting it.' })
  }
}
