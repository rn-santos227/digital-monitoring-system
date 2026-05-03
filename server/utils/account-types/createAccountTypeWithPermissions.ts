import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { CreateAccountTypeRequest } from '../../shared/requests'

interface CreateAccountTypeWithPermissionsResult {
  accountTypeId: string
}

export async function createAccountTypeWithPermissions(
  supabase: SupabaseClient,
  payload: CreateAccountTypeRequest,
): Promise<CreateAccountTypeWithPermissionsResult> {
  const { data: createdAccountType, error: accountTypeError } = await supabase
    .from('account_types')
    .insert({
      code: payload.code,
      name: payload.name,
      description: payload.description,
      is_system: payload.isSystem,
    })
    .select('id')
    .single<{ id: string }>()

  if (accountTypeError || !createdAccountType?.id) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create account type: ${accountTypeError?.message ?? 'Missing account type id.'}`,
    })
  }

  if (payload.permissionIds && payload.permissionIds.length > 0) {
    const { data: permissionMatches, error: permissionLookupError } = await supabase
      .from('permissions')
      .select('id')
      .in('id', payload.permissionIds)

    if (permissionLookupError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to validate permissions: ${permissionLookupError.message}` })
    }

    if ((permissionMatches ?? []).length !== payload.permissionIds.length) {
      throw createError({ statusCode: 400, statusMessage: 'One or more permission ids are invalid.' })
    }

    const { error: permissionInsertError } = await supabase
      .from('account_type_permissions')
      .insert(payload.permissionIds.map((permissionId) => ({
        account_type_id: createdAccountType.id,
        permission_id: permissionId,
      })))

    if (permissionInsertError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to assign account type permissions: ${permissionInsertError.message}`,
      })
    }
  }

  return {
    accountTypeId: createdAccountType.id,
  }
}
