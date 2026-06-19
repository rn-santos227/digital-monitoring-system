import { API_LOADING_MESSAGES, INCIDENT_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  CreateEquipmentIncidentPayload,
  CreateEquipmentIncidentResponse,
  EquipmentIncidentKpiCounts,
  EquipmentIncidentListItem,
  EquipmentIncidentListResponse,
  EquipmentIncidentSearchQuery,
  UpdateEquipmentIncidentPayload,
} from '~/types/domain/incident'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

const normalizeEquipmentIncidentQuery = (
  query: Partial<EquipmentIncidentSearchQuery>,
): EquipmentIncidentSearchQuery => {
  return {
    page: query.page,
    pageSize: query.pageSize,
    term: query.term?.trim() || undefined,
    incidentTypeId: query.incidentTypeId?.trim() || undefined,
    investigationStatusId: query.investigationStatusId?.trim() || undefined,
    dateFrom: query.dateFrom?.trim() || undefined,
    dateTo: query.dateTo?.trim() || undefined,
  }
}

export const hasEquipmentIncidentSearchFilters = (
  query: Partial<EquipmentIncidentSearchQuery>,
): boolean => {


}
