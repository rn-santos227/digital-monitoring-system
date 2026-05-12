import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ACCOUNT_TYPE_BASE_SELECT_COLUMNS } from '../../shared/constants'
import type { AccountTypeCreateResultRow, AccountTypePermissionSummaryRow } from '../../shared/models'
import type { CreateAccountTypeRequest } from '../../shared/requests'

interface CreateAccountTypeWithPermissionsResult {
  accountType: AccountTypeCreateResultRow
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
    .select(ACCOUNT_TYPE_BASE_SELECT_COLUMNS)
    .single()

  if (accountTypeError || !createdAccountType?.id) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create account type: ${accountTypeError?.message ?? 'Missing account type id.'}`,
    })
  }

  let permissions: AccountTypePermissionSummaryRow[] = []
  if (payload.permissionIds && payload.permissionIds.length > 0) {
    const { data: permissionMatches, error: permissionLookupError } = await supabase
      .from('permissions')
      .select('id, code, name, module')
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

    permissions = permissionMatches ?? []
  }

  return {
    accountType: {
      ...createdAccountType,
      account_type_permissions: permissions.map(permission => ({ permissions: permission })),
    },
  }
}
