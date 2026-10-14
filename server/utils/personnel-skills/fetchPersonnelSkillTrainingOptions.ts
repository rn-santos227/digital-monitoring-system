import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_SKILL_TRAINING_OPTIONS_LIMIT, PERSONNEL_SKILL_TRAINING_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSkillTrainingRow } from '../../shared/models'

export async function fetchPersonnelSkillTrainingOptions(supabase: SupabaseClient, personnelId: string, term: string, selectedId: string) {
  let query = supabase.from('training_records').select(PERSONNEL_SKILL_TRAINING_SELECT_COLUMNS)
    .eq('personnel_id', personnelId).order('training_title', { ascending: true })
    .limit(PERSONNEL_SKILL_TRAINING_OPTIONS_LIMIT)
  if (term) query = query.ilike('training_title', `%${term}%`)
  const { data, error } = await query
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to load training evidence options: ${error.message}` })
  const items = (data ?? []) as PersonnelSkillTrainingRow[]
  if (selectedId && !items.some((item) => item.id === selectedId)) {
    const selected = await supabase.from('training_records').select(PERSONNEL_SKILL_TRAINING_SELECT_COLUMNS)
      .eq('personnel_id', personnelId).eq('id', selectedId).maybeSingle<PersonnelSkillTrainingRow>()
    if (selected.error) throw createError({ statusCode: 500, statusMessage: `Failed to load selected training evidence: ${selected.error.message}` })
    if (selected.data) items.unshift(selected.data)
  }
  return items
}
