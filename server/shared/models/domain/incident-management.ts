export interface IncidentReference {
  id: string
  name: string
}

export interface IncidentCodeReference extends IncidentReference {
  code: string
}

export interface IncidentEquipmentItemReference {
  id: string
  equipment_code: string
  name: string
}

export interface IncidentEquipmentAssetReference {
  id: string
  asset_tag: string
  equipment_item: IncidentEquipmentItemReference | IncidentEquipmentItemReference[] | null
}

export interface IncidentPersonnelReference {
  id: string
  personnel_code: string
  first_name: string
  middle_name: string | null
  last_name: string
}

export interface IncidentDeploymentReference {
  id: string
  record_no: string
  operation_name: string
  deployment_area: string | null
}

export interface EquipmentIncidentRow {
  id: string
  incident_no: string
  equipment_asset_id: string
  personnel_id: string | null
  deployment_id: string | null
  incident_type_id: string
  incident_date: string
  location: string | null
  location_latitude: number | null
  location_longitude: number | null
  description: string
  investigation_status_id: string | null
  resolution: string | null
  remarks: string | null
  created_at: string
  updated_at: string
  equipment_asset: IncidentEquipmentAssetReference | IncidentEquipmentAssetReference[] | null
  personnel: IncidentPersonnelReference | IncidentPersonnelReference[] | null
  deployment: IncidentDeploymentReference | IncidentDeploymentReference[] | null
  incident_type: IncidentCodeReference | IncidentCodeReference[] | null
  investigation_status: IncidentReference | IncidentReference[] | null
}

export interface EquipmentIncidentCreate {
  incident_no: string
  equipment_asset_id: string
  personnel_id: string | null
  deployment_id: string | null
  incident_type_id: string
  incident_date: string
  location: string | null
  location_latitude: number | null
  location_longitude: number | null
  description: string
  investigation_status_id: string | null
  resolution: string | null
  remarks: string | null
}
