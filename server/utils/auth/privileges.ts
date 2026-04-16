import { getServiceSupabaseClient } from './serviceClient'

interface UserAccountTypePermissionRow {
  permissions: {
    code: string
  } | null
}

interface UserAccountTypeRow {
  account_types: {
    code: string
    account_type_permissions: UserAccountTypePermissionRow[] | null
  } | null
}

export interface UserPrivilegeClaims {
  accountTypeCodes: string[]
  permissionCodes: string[]
}

const buildUserPrivilegeClaims = (rows: UserAccountTypeRow[] | null): UserPrivilegeClaims => {
  const accountTypeCodes = new Set<string>()
  const permissionCodes = new Set<string>()

  rows?.forEach((row) => {
    const accountTypeCode = row.account_types?.code

    if (accountTypeCode) {
      accountTypeCodes.add(accountTypeCode)
    }

    row.account_types?.account_type_permissions?.forEach((permissionRow) => {
      const permissionCode = permissionRow.permissions?.code

      if (permissionCode) {
        permissionCodes.add(permissionCode)
      }
    })
  })

  return {
    accountTypeCodes: [...accountTypeCodes],
    permissionCodes: [...permissionCodes],
  }
}

export const fetchUserPrivilegeClaims = async (userId: string): Promise<UserPrivilegeClaims> => {
  const supabase = getServiceSupabaseClient()

  const { data: accountTypeRows } = await supabase
    .from('user_account_types')
    .select('account_types!inner(code, account_type_permissions(permissions(code)))')
    .eq('user_id', userId)
    .returns<UserAccountTypeRow[]>()

  return buildUserPrivilegeClaims(accountTypeRows ?? null)
}
