import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_SKILL_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSkillRow } from '../../shared/models'

export async function getPersonnelSkillById(supabase: SupabaseClient, personnelId: string, skillId: string): Promise<PersonnelSkillRow> {
  const { data, error } = await supabase.from('personnel_qualifications')
    .select(PERSONNEL_SKILL_SELECT_COLUMNS)
    .eq('personnel_id', personnelId).eq('id', skillId).maybeSingle<PersonnelSkillRow>()
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to fetch personnel skill: ${error.message}` })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Personnel skill not found.' })
  return data
}
