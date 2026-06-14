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

