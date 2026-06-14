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
