import { API_LOADING_MESSAGES, INCIDENT_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  CreateEquipmentIncidentPayload,
  CreateEquipmentIncidentResponse,
  EquipmentIncidentKpiCounts,
  EquipmentIncidentListItem,
  EquipmentIncidentListResponse,
  EquipmentIncidentSearchQuery,
  IncidentTypeSuggestionResponse,
  InvestigationStatusSuggestionResponse,
  UpdateEquipmentIncidentPayload,
  UpdateEquipmentIncidentDeploymentPayload,
  UpdateEquipmentIncidentDetailsPayload,
  UpdateEquipmentIncidentEquipmentPayload,
  UpdateEquipmentIncidentPersonnelPayload,
  UpdateEquipmentIncidentLocationPayload,
  UpdateEquipmentIncidentStatusPayload,
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
    fields: query.fields?.trim() || undefined,
    conditions: query.conditions?.trim() || undefined,
    match: query.match === 'any' ? 'any' : query.match === 'all' ? 'all' : undefined,
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

export const getIncidentTypeSuggestionsEndpoint = async (term = ''): Promise<IncidentTypeSuggestionResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<IncidentTypeSuggestionResponse>(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentTypeSuggestions, {
      method: 'GET',
      headers: createSessionHeaders(),
      query: { term },
    })
  }, API_LOADING_MESSAGES.fetchEquipmentIncidentDetails)
}

export const getInvestigationStatusSuggestionsEndpoint = async (term = ''): Promise<InvestigationStatusSuggestionResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<InvestigationStatusSuggestionResponse>(INCIDENT_MANAGEMENT_API_ENDPOINTS.investigationStatusSuggestions, {
      method: 'GET',
      headers: createSessionHeaders(),
      query: { term },
    })
  }, API_LOADING_MESSAGES.fetchEquipmentIncidentDetails)
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
    await $fetch(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentById(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateEquipmentIncident)
}

const updateEquipmentIncidentSectionEndpoint = async <TPayload extends object>(
  endpoint: string,
  payload: TPayload,
): Promise<void> => {
  await withApiLoading(async () => {
    await $fetch(endpoint, {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateEquipmentIncident)
}

export const updateEquipmentIncidentDeploymentEndpoint = async (
  id: string,
  payload: UpdateEquipmentIncidentDeploymentPayload,
): Promise<void> => {
  await updateEquipmentIncidentSectionEndpoint(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentDeploymentById(id), payload)
}

export const updateEquipmentIncidentDetailsEndpoint = async (
  id: string,
  payload: UpdateEquipmentIncidentDetailsPayload,
): Promise<void> => {
  await updateEquipmentIncidentSectionEndpoint(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentDetailsById(id), payload)
}

export const updateEquipmentIncidentEquipmentEndpoint = async (
  id: string,
  payload: UpdateEquipmentIncidentEquipmentPayload,
): Promise<void> => {
  await updateEquipmentIncidentSectionEndpoint(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentEquipmentById(id), payload)
}

export const updateEquipmentIncidentPersonnelEndpoint = async (
  id: string,
  payload: UpdateEquipmentIncidentPersonnelPayload,
): Promise<void> => {
  await updateEquipmentIncidentSectionEndpoint(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentPersonnelById(id), payload)
}

export const updateEquipmentIncidentLocationEndpoint = async (
  id: string,
  payload: UpdateEquipmentIncidentLocationPayload,
): Promise<void> => {
  await updateEquipmentIncidentSectionEndpoint(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentLocationById(id), payload)
}

export const updateEquipmentIncidentStatusEndpoint = async (
  id: string,
  payload: UpdateEquipmentIncidentStatusPayload,
): Promise<void> => {
  await updateEquipmentIncidentSectionEndpoint(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentStatusById(id), payload)
}

export const deleteEquipmentIncidentEndpoint = async (id: string): Promise<void> => {
  await withApiLoading(async () => {
    await $fetch(INCIDENT_MANAGEMENT_API_ENDPOINTS.incidentById(id), {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteEquipmentIncident)
}
