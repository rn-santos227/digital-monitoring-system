import { createError } from 'h3'
import { USER_PROFILE_COMPACT_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'
import { getServiceSupabaseClient } from '../auth/serviceClient'
import type { FetchUserProfilesListResult } from './fetchUserProfilesList'

interface SearchUserProfilesOptions {
  actorId: string
  term: string
  isActive: boolean | null
  searchFields: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  rangeFrom: number
  rangeTo: number
}

export const searchUserProfile = async <T>(
  options: SearchUserProfilesOptions,
): Promise<FetchUserProfilesListResult<T>> => {
  const supabase = getServiceSupabaseClient()
  let query = supabase
    .from('user_profiles')
    .select(USER_PROFILE_COMPACT_SELECT_COLUMNS, { count: 'exact' })
    .neq('id', options.actorId)

  if (options.term) {
    query = query.or(options.searchFields.map(field => `${field}.ilike.%${options.term}%`).join(','))
  }

  if (options.advancedFilters.length) {
    query = applyPersonnelSearchFilters(query, options.advancedFilters, options.match)
  }

  if (typeof options.isActive === 'boolean') {
    query = query.eq('is_active', options.isActive)
  }

  const { data, count, error } = await query
    .order('full_name', { ascending: true })
    .range(options.rangeFrom, options.rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search user profiles: ${error.message}` })
  }
}
