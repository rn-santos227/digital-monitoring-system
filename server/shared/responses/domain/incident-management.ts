import type {
  EquipmentIncidentListItem,
  IncidentTypeSuggestionItem,
  InvestigationStatusSuggestionItem,
} from '../../models'

export interface EquipmentIncidentListResponse {
  items: EquipmentIncidentListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface CreateEquipmentIncidentResponse {
  ok: true
  id: string
  item: EquipmentIncidentListItem
}

export interface IncidentKpiResponse {
  totalIncidents: number
  unresolvedIncidents: number
  incidentsThisMonth: number
}

export interface IncidentTypeSuggestionResponse {
  items: IncidentTypeSuggestionItem[]
}

