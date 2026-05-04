import { createError } from 'h3'
import { USER_PROFILE_COMPACT_SELECT_COLUMNS } from '../../shared/constants'
import { getServiceSupabaseClient } from '../auth/serviceClient'

export interface FetchUserProfilesListParams {
  actorId: string
  rangeFrom: number
  rangeTo: number
  term?: string
  isActive?: boolean | null
  searchFields?: string[]
}

export interface FetchUserProfilesListResult<T> {
  data: T[]
  count: number
}

export async function fetchUserProfilesList<T>(params: FetchUserProfilesListParams): Promise<FetchUserProfilesListResult<T>> {
  const { actorId, rangeFrom, rangeTo, term = '', isActive = null, searchFields = [] } = params
  const supabase = getServiceSupabaseClient()

  let profileQuery = supabase
    .from('user_profiles')
    .select(USER_PROFILE_COMPACT_SELECT_COLUMNS, { count: 'exact' })
    .neq('id', actorId)
    .order('full_name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (term && searchFields.length > 0) {
    const filters = searchFields.map((field) => `${field}.ilike.%${term}%`)
    profileQuery = profileQuery.or(filters.join(','))
  } else if (term) {
    profileQuery = profileQuery.or(`email.ilike.%${term}%,full_name.ilike.%${term}%`)
  }

  if (typeof isActive === 'boolean') {
    profileQuery = profileQuery.eq('is_active', isActive)
  }

  const { data, count, error } = await profileQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch user profiles: ${error.message}` })
  }

  return {
    data: (data ?? []) as T[],
    count: count ?? 0,
  }
}
