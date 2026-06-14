export interface IncidentReference {
  id: string
  name: string
}

export interface IncidentCodeReference extends IncidentReference {
  code: string
}
