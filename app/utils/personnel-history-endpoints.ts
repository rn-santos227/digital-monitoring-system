import { PERSONNEL_HISTORY_API_ENDPOINTS } from '~/constants/api.constants'
import type { PersonnelHistoryKind, PersonnelHistoryResponse, SavePersonnelHistoryRequest, SavePersonnelHistoryResponse } from '~/types/domain/personnel-history'
import { createSessionHeaders } from '~/utils/auth-session'

export const getPersonnelHistoryEndpoint = async (personnelId: string, kind: PersonnelHistoryKind, page: number, pageSize: number) => {
  return await $fetch<PersonnelHistoryResponse>(PERSONNEL_HISTORY_API_ENDPOINTS[kind](personnelId), {
    method: 'GET', headers: createSessionHeaders(), query: { page, pageSize },
  })
}
export const createPersonnelHistoryEndpoint = async (personnelId: string, kind: PersonnelHistoryKind, body: SavePersonnelHistoryRequest) => {
  return await $fetch<SavePersonnelHistoryResponse>(PERSONNEL_HISTORY_API_ENDPOINTS[kind](personnelId), {
    method: 'POST', headers: createSessionHeaders(), body,
  })
}
export const updatePersonnelHistoryEndpoint = async (personnelId: string, kind: PersonnelHistoryKind, recordId: string, body: SavePersonnelHistoryRequest) => {
  return await $fetch<SavePersonnelHistoryResponse>(`${PERSONNEL_HISTORY_API_ENDPOINTS[kind](personnelId)}/${encodeURIComponent(recordId)}`, {
    method: 'PATCH', headers: createSessionHeaders(), body,
  })
}
export const deletePersonnelHistoryEndpoint = async (personnelId: string, kind: PersonnelHistoryKind, recordId: string) => {
  return await $fetch<{ ok: true }>(`${PERSONNEL_HISTORY_API_ENDPOINTS[kind](personnelId)}/${encodeURIComponent(recordId)}`, {
    method: 'DELETE', headers: createSessionHeaders(),
  })
}
