import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { USER_PROFILE_CREATE_SELECT_COLUMNS } from '../../shared/constants'
import type { CreateUserProfilePayload, UserAccountTypeSummaryRow, UserProfileCreate, UserProfileCreateResultRow } from '../../shared/models'
import { replaceUserAccountTypes } from './replaceUserAccountTypes'
import { validateUserPersonnelAssignment } from './validateUserPersonnelAssignment'

interface CreateUserProfileWithAccountTypesParams {
  supabase: SupabaseClient
  payload: CreateUserProfilePayload
  assignedByUserId: string
}

export async function createUserProfileWithAccountTypes(params: CreateUserProfileWithAccountTypesParams): Promise<UserProfileCreateResultRow> {
  const { supabase, payload, assignedByUserId } = params

  if (payload.personnelId) {
    await validateUserPersonnelAssignment({
      supabase,
      personnelId: payload.personnelId,
    })
  }

  const { data: createdAuthUser, error: createAuthUserError } = await supabase.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    email_confirm: true,
    user_metadata: { full_name: payload.fullName },
  })

  const createdUserId = createdAuthUser.user?.id ?? null
  if (createAuthUserError || !createdUserId) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create auth user: ${createAuthUserError?.message ?? 'Missing auth user id.'}` })
  }

  const userProfileCreate: UserProfileCreate = {
    id: createdUserId,
    personnel_id: payload.personnelId,
    email: payload.email,
    full_name: payload.fullName,
    avatar_url: payload.avatarUrl,
  }

  const { data: createdProfile, error: profileInsertError } = await supabase
    .from('user_profiles')
    .insert(userProfileCreate)
    .select(USER_PROFILE_CREATE_SELECT_COLUMNS)
    .single()

  if (profileInsertError || !createdProfile) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create user profile: ${profileInsertError?.message ?? 'Missing created profile.'}` })
  }

  let accountTypes: UserAccountTypeSummaryRow[] = []
  if (payload.accountTypeIds.length > 0) {
    accountTypes = await replaceUserAccountTypes({
      supabase,
      userId: createdUserId,
      accountTypeIds: payload.accountTypeIds,
      assignedBy: assignedByUserId,
    })
  }

  return {
    ...createdProfile,
    user_account_types: accountTypes.map(accountType => ({
      account_types: accountType,
    })),
  }
}
