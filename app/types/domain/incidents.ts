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
}
