export interface CreateEquipmentIncidentRequest {
  incidentNo?: string
  equipmentAssetId?: string
  personnelId?: string | null
  deploymentId?: string | null
  incidentTypeId?: string
  incidentDate?: string
  location?: string | null
  locationLatitude?: number | string | null
  locationLongitude?: number | string | null
  description?: string
  investigationStatusId?: string | null
  resolution?: string | null
  remarks?: string | null
}

export interface UpdateEquipmentIncidentRequest extends Partial<CreateEquipmentIncidentRequest> {}
