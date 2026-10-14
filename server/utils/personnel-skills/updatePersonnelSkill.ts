import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_SKILL_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSkillRow, PersonnelSkillWrite } from '../../shared/models'
import { mapPersonnelSkill } from '../../shared/utils'

export async function updatePersonnelSkill(supabase: SupabaseClient, personnelId: string, skillId: string, payload: PersonnelSkillWrite) {
  const { data, error } = await supabase.from('personnel_qualifications')
    .update(payload).eq('personnel_id', personnelId).eq('id', skillId)
    .select(PERSONNEL_SKILL_SELECT_COLUMNS).maybeSingle<PersonnelSkillRow>()
  if (error) {
    throw createError({ statusCode: error.code === '23503' ? 409 : 500, statusMessage: `Failed to update personnel skill: ${error.message}` })
  }
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Personnel skill not found.' })
  return mapPersonnelSkill(data)
}
