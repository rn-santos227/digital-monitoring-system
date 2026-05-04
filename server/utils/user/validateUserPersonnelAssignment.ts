import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ID_ONLY_SELECT_COLUMNS, USER_PROFILE_PERSONNEL_LOOKUP_SELECT_COLUMNS } from '../../shared/constants'
import { assertPersonnelExists, buildAssignedPersonnelProfileMap } from '../../shared/utils'

interface ValidateUserPersonnelAssignmentParams {
  supabase: SupabaseClient
  personnelId: string
  currentUserId?: string
}

export async function validateUserPersonnelAssignment(params: ValidateUserPersonnelAssignmentParams): Promise<void> {
  const { supabase, personnelId, currentUserId } = params

  await assertPersonnelExists({ supabase, personnelId, idSelectColumns: ID_ONLY_SELECT_COLUMNS })

  const { data: assignedProfiles, error } = await supabase
    .from('user_profiles')
    .select(USER_PROFILE_PERSONNEL_LOOKUP_SELECT_COLUMNS)
    .eq('personnel_id', personnelId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to validate personnel assignment: ${error.message}` })
  }

  const assignedProfile = buildAssignedPersonnelProfileMap(assignedProfiles ?? []).get(personnelId)
  if (assignedProfile && assignedProfile.id !== currentUserId) {
    throw createError({ statusCode: 409, statusMessage: 'Selected personnel is already assigned to another user profile.' })
  }
}
