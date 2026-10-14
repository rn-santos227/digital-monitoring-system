import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_SKILL_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSkillRow } from '../../shared/models'
import { mapPersonnelSkill } from '../../shared/utils'

export async function fetchPersonnelSkills(supabase: SupabaseClient, personnelId: string, rangeFrom: number, rangeTo: number) {
  const { data, error, count } = await supabase.from('personnel_qualifications')
    .select(PERSONNEL_SKILL_SELECT_COLUMNS, { count: 'exact' })
    .eq('personnel_id', personnelId)
    .order('created_at', { ascending: false }).order('id', { ascending: false })
    .range(rangeFrom, rangeTo)
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to fetch personnel skills: ${error.message}` })
  return { items: ((data ?? []) as PersonnelSkillRow[]).map(mapPersonnelSkill), totalItems: count ?? 0 }
}
