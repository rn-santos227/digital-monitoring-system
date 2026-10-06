import { defineEventHandler, getRouterParam } from 'h3'
import type { AccountTypeDetailResponse } from '../../../shared/responses'
import { MANAGEMENT_PERMISSION_GROUPS } from '../../../shared/constants'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getAccountTypeDetailById } from '../../../utils/account-types/getAccountTypeDetailById'
import { requireRouteId } from '../../../shared/validation'

export default defineEventHandler(async (event): Promise<AccountTypeDetailResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.accountTypeManagement)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Account type id is required.')

  const supabase = getServiceSupabaseClient()
  const data = await getAccountTypeDetailById(supabase, id)

  const permissions = (data.account_type_permissions ?? [])
    .flatMap((row) => {
      if (!row.permissions) {
        return []
      }

      if (Array.isArray(row.permissions)) {
        return row.permissions
      }

      return [row.permissions]
    })

  return {
    id: data.id,
    code: data.code,
    name: data.name,
    description: data.description,
    isSystem: data.is_system,
    permissions,
  }
})
