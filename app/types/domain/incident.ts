export interface IncidentTypeSuggestionItem {
  id: string
  code: string
  name: string
}

export interface InvestigationStatusSuggestionItem {
  id: string
  name: string
}

export interface IncidentTypeSuggestionResponse {
  items: IncidentTypeSuggestionItem[]
}

export interface InvestigationStatusSuggestionResponse {
  items: InvestigationStatusSuggestionItem[]
}

export interface EquipmentIncidentEndpointQuery {
  page?: number
  pageSize?: number
}

export interface EquipmentIncidentSearchQuery extends EquipmentIncidentEndpointQuery {
  term?: string
  incidentTypeId?: string
  investigationStatusId?: string
  dateFrom?: string
  dateTo?: string
}

export interface EquipmentIncidentListItem {
  id: string
  incidentNo: string
  equipmentAssetId: string
  assetTag: string
  equipmentCode: string | null
  equipmentName: string | null
  personnelId: string | null
  personnelCode: string | null
  personnelName: string | null
  deploymentId: string | null
  deploymentRecordNo: string | null
  deploymentName: string | null
  deploymentArea: string | null
  incidentTypeId: string
  incidentTypeCode: string | null
  incidentTypeName: string | null
  incidentDate: string
  location: string | null
  locationLatitude: number | null
  locationLongitude: number | null
  description: string
  investigationStatusId: string | null
  investigationStatusName: string | null
  resolution: string | null
  remarks: string | null
  createdAt: string
  updatedAt: string
}

export type EquipmentIncidentTableRow = EquipmentIncidentListItem

export interface EquipmentIncidentListResponse {
  items: EquipmentIncidentListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface EquipmentIncidentKpiCounts {
  totalIncidents: number
  unresolvedIncidents: number
  incidentsThisMonth: number
}

export interface CreateEquipmentIncidentPayload {
  incidentNo: string
  equipmentAssetId: string
  personnelId?: string | null
  deploymentId?: string | null
  incidentTypeId: string
  incidentDate: string
  location?: string | null
  locationLatitude?: number | null
  locationLongitude?: number | null
  description: string
  investigationStatusId?: string | null
  resolution?: string | null
  remarks?: string | null
}

export type UpdateEquipmentIncidentPayload = Partial<CreateEquipmentIncidentPayload>

export interface CreateEquipmentIncidentResponse {
  ok: boolean
  id: string
  item: EquipmentIncidentListItem
}


export interface EquipmentIncidentsState {
  items: EquipmentIncidentListItem[]
  kpis: EquipmentIncidentKpiCounts
  hasLoadedKpis: boolean
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
  isLoading: boolean
  isCreating: boolean
  error: string
  createError: string
}
