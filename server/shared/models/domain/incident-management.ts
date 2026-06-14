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

