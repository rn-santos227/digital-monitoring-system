import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ACCOUNT_TYPE_SUMMARY_SELECT_COLUMNS } from '../../shared/constants'
import type { UserAccountTypeSummaryRow } from '../../shared/models'

interface ReplaceUserAccountTypesParams {
  supabase: SupabaseClient
  userId: string
  accountTypeIds: string[]
  assignedBy?: string
}

export async function replaceUserAccountTypes(params: ReplaceUserAccountTypesParams): Promise<UserAccountTypeSummaryRow[]> {
  const { supabase, userId, accountTypeIds, assignedBy } = params

  if (accountTypeIds.length > 1) {
    throw createError({ statusCode: 400, statusMessage: 'Only one account type can be assigned to a user.' })
  }

  const { data: accountTypeMatches, error: accountTypeLookupError } = await supabase
    .from('account_types')
    .select(ACCOUNT_TYPE_SUMMARY_SELECT_COLUMNS)
    .in('id', accountTypeIds)

  if (accountTypeLookupError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to validate account types: ${accountTypeLookupError.message}` })
  }

  if ((accountTypeMatches ?? []).length !== accountTypeIds.length) {
    throw createError({ statusCode: 400, statusMessage: 'One or more account type ids are invalid.' })
  }

  const { error: clearAssignmentsError } = await supabase.from('user_account_types').delete().eq('user_id', userId)
  if (clearAssignmentsError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to clear account type assignments: ${clearAssignmentsError.message}` })
  }

  if (accountTypeIds.length === 0) {
    return []
  }

  const { error: assignError } = await supabase.from('user_account_types').insert(
    accountTypeIds.map((accountTypeId) => ({ user_id: userId, account_type_id: accountTypeId, assigned_by: assignedBy })),
  )

  if (assignError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to assign account types: ${assignError.message}` })
  }

  return accountTypeMatches ?? []
}
