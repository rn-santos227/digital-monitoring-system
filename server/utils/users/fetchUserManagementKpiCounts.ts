import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserManagementKpiCounts } from '../../shared/models'
import { fetchStringColumnValues, resolveCountResult } from '../kpis/countTableRows'

const countUserProfilesByActiveState = async (
  supabase: SupabaseClient,
  isActive: boolean,
): Promise<number> => {
  const result = await supabase
    .from('user_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', isActive)

  return resolveCountResult(result, isActive ? 'active user profiles' : 'inactive user profiles')
}

export const fetchUserManagementKpiCounts = async (
  supabase: SupabaseClient,
): Promise<UserManagementKpiCounts> => {
  const [
    activeUsers,
    inactiveUsers,
    accountTypeIds,
    usedAccountTypeIds,
  ] = await Promise.all([
    countUserProfilesByActiveState(supabase, true),
    countUserProfilesByActiveState(supabase, false),
    fetchStringColumnValues(supabase, 'account_types', 'id', 'account type ids'),
    fetchStringColumnValues(supabase, 'user_account_types', 'account_type_id', 'user account type ids'),
  ])

  const usedAccountTypeIdSet = new Set(usedAccountTypeIds)
  const unusedAccountTypes = accountTypeIds.filter((accountTypeId) => {
    return !usedAccountTypeIdSet.has(accountTypeId)
  }).length

  return {
    activeUsers,
    inactiveUsers,
    totalAccountTypes: accountTypeIds.length,
    unusedAccountTypes: Math.max(0, unusedAccountTypes),
  }
}
