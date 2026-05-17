import { PERSONNEL_API_ENDPOINTS } from '~/constants/api.constants'
import type { PersonnelLocationItem  } from '../types/domain/personnel'

interface PersonnelLocationsResponse {
  items: PersonnelLocationItem[]
}

export const fetchPersonnelLocationsEndpoint = async (): Promise<PersonnelLocationItem[]> => {
  const response = await $fetch<PersonnelLocationsResponse>(PERSONNEL_API_ENDPOINTS.locations)
  return response.items ?? []
}
