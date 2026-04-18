import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { AccountTypeDetailResponse } from '../../../shared/responses'
import { ACCOUNT_TYPE_DETAIL_SELECT_COLUMNS, MANAGEMENT_PERMISSION_GROUPS } from '../../../shared/constants'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { requireRouteId } from '../../../shared/validations'

export default defineEventHandler(async (event): Promise<AccountTypeDetailResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.accountTypeManagement)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Account type id is required.')

  const supabase = getServiceSupabaseClient()
  const { data, error } = await supabase
    .from('account_types')
    .select(ACCOUNT_TYPE_DETAIL_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch account type details: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Account type not found.' })
  }

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
