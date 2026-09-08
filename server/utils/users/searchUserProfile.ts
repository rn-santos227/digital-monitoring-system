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


}
