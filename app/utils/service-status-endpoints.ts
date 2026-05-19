import { API_LOADING_MESSAGES, PERSONNEL_API_ENDPOINTS } from '~/constants/api.constants'
import type { CreateDeploymentRecordPayload } from '~/types/domain/deployment'
import type { CreateEngagementRecordPayload } from '~/types/domain/engagement'
import type { PersonnelLocationItem } from '~/types/domain/personnel'
import type { CreateTrainingRecordPayload } from '~/types/domain/training'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

interface PersonnelLocationsResponse {
  items: PersonnelLocationItem[]
}

export const fetchPersonnelLocationsEndpoint = async (): Promise<PersonnelLocationItem[]> => {
  const response = await $fetch<PersonnelLocationsResponse>(PERSONNEL_API_ENDPOINTS.locations)
  return response.items ?? []
}

export const assignPersonnelDeploymentRecordEndpoint = async (
  personnelId: string,
  payload: CreateDeploymentRecordPayload,
) => {
  return await withApiLoading(async () => {
    return await $fetch(PERSONNEL_API_ENDPOINTS.personnelDeploymentRecord(personnelId), {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createDeployment)
}

export const assignPersonnelEngagementRecordEndpoint = async (
  personnelId: string,
  payload: CreateEngagementRecordPayload,
) => {
  return await withApiLoading(async () => {
    return await $fetch(PERSONNEL_API_ENDPOINTS.personnelEngagementRecord(personnelId), {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createEngagementRecord)
}
