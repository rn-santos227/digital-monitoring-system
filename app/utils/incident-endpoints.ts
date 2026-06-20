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
  const normalizedQuery = normalizeEquipmentIncidentQuery(query)
  return await withApiLoading(async () => {
    return await $fetch<EquipmentIncidentListResponse>(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentsSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query: normalizedQuery,
    })
  }, API_LOADING_MESSAGES.fetchEquipmentIncidents)
}

export const getEquipmentIncidentKpisEndpoint = async (): Promise<EquipmentIncidentKpiCounts> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentIncidentKpiCounts>(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentsKpis, {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEquipmentIncidentKpis)
}

export const getEquipmentIncidentByIdEndpoint = async (id: string): Promise<EquipmentIncidentListItem> => {
  return await withApiLoading(async () => {
    return await $fetch<EquipmentIncidentListItem>(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEquipmentIncidentDetails)
}

export const createEquipmentIncidentEndpoint = async (
  payload: CreateEquipmentIncidentPayload,
): Promise<CreateEquipmentIncidentResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreateEquipmentIncidentResponse>(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidents, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createEquipmentIncident)
}

export const updateEquipmentIncidentEndpoint = async (
  id: string,
  payload: UpdateEquipmentIncidentPayload,
): Promise<void> => {
  await withApiLoading(async () => {
    return await $fetch<CreateEquipmentIncidentResponse>(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidents, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateEquipmentIncident)
}

export const updateEquipmentIncidentEndpoint = async (
  id: string,
  payload: UpdateEquipmentIncidentPayload,
): Promise<void> => {
  await withApiLoading(async () => {
    await $fetch(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentById(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateEquipmentIncident)
}
