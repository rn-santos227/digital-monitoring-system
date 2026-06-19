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
