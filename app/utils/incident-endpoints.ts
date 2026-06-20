import { API_LOADING_MESSAGES, INCIDENT_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  CreateEquipmentIncidentPayload,
  CreateEquipmentIncidentResponse,
  EquipmentIncidentKpiCounts,
  EquipmentIncidentListItem,
  EquipmentIncidentListResponse,
  EquipmentIncidentSearchQuery,
  UpdateEquipmentIncidentPayload,
} from '~/types/domain/incident'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

const normalizeEquipmentIncidentQuery = (
  query: Partial<EquipmentIncidentSearchQuery>,
): EquipmentIncidentSearchQuery => {
  return {
    page: query.page,
    pageSize: query.pageSize,
    term: query.term?.trim() || undefined,
    incidentTypeId: query.incidentTypeId?.trim() || undefined,
    investigationStatusId: query.investigationStatusId?.trim() || undefined,
    dateFrom: query.dateFrom?.trim() || undefined,
    dateTo: query.dateTo?.trim() || undefined,
  }
}

export const hasEquipmentIncidentSearchFilters = (
  query: Partial<EquipmentIncidentSearchQuery>,
): boolean => {
  const normalizedQuery = normalizeEquipmentIncidentQuery(query)

  return Boolean(
    normalizedQuery.term
    || normalizedQuery.incidentTypeId
    || normalizedQuery.investigationStatusId
    || normalizedQuery.dateFrom
    || normalizedQuery.dateTo,
  )
}

export const getEquipmentIncidentsEndpoint = async (
  query: Partial<EquipmentIncidentSearchQuery>,
): Promise<EquipmentIncidentListResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentIncidentListResponse>(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidents, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentIncidents)
}

export const searchEquipmentIncidentsEndpoint = async (
  query: Partial<EquipmentIncidentSearchQuery>,
): Promise<EquipmentIncidentListResponse> => {


}
