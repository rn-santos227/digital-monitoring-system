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

