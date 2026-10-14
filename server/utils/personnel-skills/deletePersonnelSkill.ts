import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ID_ONLY_SELECT_COLUMNS } from '../../shared/constants'

export async function deletePersonnelSkill(supabase: SupabaseClient, personnelId: string, skillId: string): Promise<void> {
  const { data, error } = await supabase.from('personnel_qualifications')
    .delete().eq('personnel_id', personnelId).eq('id', skillId)
    .select(ID_ONLY_SELECT_COLUMNS).maybeSingle()
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to remove personnel skill: ${error.message}` })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Personnel skill not found.' })
}
