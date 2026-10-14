import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_SKILL_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSkillRow, PersonnelSkillWrite } from '../../shared/models'
import { mapPersonnelSkill } from '../../shared/utils'

export async function createPersonnelSkill(supabase: SupabaseClient, personnelId: string, payload: PersonnelSkillWrite) {
  // PostgREST performs the insert and returned selection in one DB transaction.
  const { data, error } = await supabase.from('personnel_qualifications')
    .insert({ ...payload, personnel_id: personnelId })
    .select(PERSONNEL_SKILL_SELECT_COLUMNS).single<PersonnelSkillRow>()
  if (error || !data) {
    throw createError({
      statusCode: error?.code === '23503' ? 409 : 500,
      statusMessage: `Failed to add personnel skill: ${error?.message ?? 'Missing created skill.'}`,
    })
  }
  return mapPersonnelSkill(data)
}
